package servicehub.system.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import servicehub.system.DTO.AuthRequest;
import servicehub.system.DTO.AuthRespons;
import servicehub.system.DTO.RegisterRequest;
import servicehub.system.Entity.CustomerProfile;
import servicehub.system.Entity.User;
import servicehub.system.Entity.WorkerProfile;
import servicehub.system.Repository.CustomerProfileRepository;
import servicehub.system.Repository.UserRepository;
import servicehub.system.Repository.WorkerRepository;
import servicehub.system.Security.JwtUtil;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final WorkerRepository workerProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthRespons register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create user entity
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .userType(request.getUserType())
                .isActive(true)
                .isBlocked(false)
                .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getEmail());

        // Create profile based on user type
        if (request.getUserType() == User.UserType.WORKER) {
            WorkerProfile workerProfile = WorkerProfile.builder()
                    .user(user)
                    .serviceCategory(request.getServiceCategory())
                    .hourlyRate(request.getHourlyRate())
                    .bio(request.getBio())
                    .skills(request.getSkills())
                    .yearsOfExperience(request.getYearsOfExperience())
                    .isAvailable(true)
                    .verified(false)
                    .build();
            workerProfileRepository.save(workerProfile);
            log.info("Worker profile created for: {}", user.getEmail());
        } else if (request.getUserType() == User.UserType.CUSTOMER) {
            CustomerProfile customerProfile = CustomerProfile.builder()
                    .user(user)
                    .address(request.getAddress())
                    .city(request.getCity())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .build();
            customerProfileRepository.save(customerProfile);
            log.info("Customer profile created for: {}", user.getEmail());
        } else if (request.getUserType() == User.UserType.ADMIN) {
            // Admin registration
            validateAdminKey(request.getAdminKey());
            log.info("Admin account created for: {}", user.getEmail());
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserType().toString());

        return new AuthRespons(
                token,
                null,
                AuthRespons.UserDTO.fromUser(user)
        );
    }

    public AuthRespons login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("User account is inactive");
        }

        if (user.getIsBlocked()) {
            throw new RuntimeException("User account is blocked");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserType().toString());

        return new AuthRespons(
                token,
                null,
                AuthRespons.UserDTO.fromUser(user)
        );
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public Long getUserIdFromToken(String token) {
        return jwtUtil.getUserIdFromToken(token);
    }

    public String getEmailFromToken(String token) {
        return jwtUtil.getEmailFromToken(token);
    }

    public String getUserTypeFromToken(String token) {
        return jwtUtil.getUserTypeFromToken(token);
    }

    private void validateAdminKey(String adminKey) {
        // Admin key should be provided during admin registration
        // This is a basic validation - in production, use environment variables
        String expectedAdminKey = System.getenv("ADMIN_REGISTRATION_KEY");
        if (expectedAdminKey == null) {
            expectedAdminKey = "ADMIN_KEY_12345"; // Default for development
        }

        if (!expectedAdminKey.equals(adminKey)) {
            throw new RuntimeException("Invalid admin verification key");
        }
    }
}

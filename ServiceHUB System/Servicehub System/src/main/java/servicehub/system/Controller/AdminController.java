package servicehub.system.Controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import servicehub.system.Entity.Booking;
import servicehub.system.Entity.User;
import servicehub.system.Entity.Voucher;
import servicehub.system.Repository.BookingRepository;
import servicehub.system.Repository.UserRepository;
import servicehub.system.Repository.VoucherRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final VoucherRepository voucherRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String email) {
        try {
            List<User> users = userRepository.findByEmailContaining(email);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setIsBlocked(true);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User blocked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setIsBlocked(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User unblocked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setIsActive(false);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(@PathVariable String status) {
        try {
            List<Booking> bookings = bookingRepository.findByStatus(status);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Voucher Management
    @PostMapping("/vouchers")
    public ResponseEntity<?> createVoucher(@RequestBody VoucherRequest request) {
        try {
            Voucher voucher = Voucher.builder()
                    .code(request.getCode())
                    .discountPercentage(request.getDiscountPercentage())
                    .discountAmount(request.getDiscountAmount())
                    .validFrom(LocalDateTime.now())
                    .validUntil(request.getExpiryDate())
                    .maxUses(request.getMaxUses())
                    .currentUses(0)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            voucherRepository.save(voucher);
            return ResponseEntity.status(HttpStatus.CREATED).body(voucher);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/vouchers")
    public ResponseEntity<?> getAllVouchers() {
        try {
            List<Voucher> vouchers = voucherRepository.findAll();
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/vouchers/active")
    public ResponseEntity<?> getActiveVouchers() {
        try {
            List<Voucher> vouchers = voucherRepository.findByIsActive(true);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/vouchers/{voucherId}/deactivate")
    public ResponseEntity<?> deactivateVoucher(@PathVariable Long voucherId) {
        try {
            Voucher voucher = voucherRepository.findById(voucherId)
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            voucher.setIsActive(false);
            voucherRepository.save(voucher);
            return ResponseEntity.ok(Map.of("message", "Voucher deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", userRepository.count());
            stats.put("totalBookings", bookingRepository.count());
            stats.put("activeVouchers", voucherRepository.countByIsActive(true));
            stats.put("blockedUsers", userRepository.countByIsBlocked(true));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Inner class for voucher request
    @Data
    public static class VoucherRequest {
        private String code;
        private BigDecimal discountPercentage;
        private BigDecimal discountAmount;
        private LocalDateTime expiryDate;
        private Integer maxUses;
    }
}

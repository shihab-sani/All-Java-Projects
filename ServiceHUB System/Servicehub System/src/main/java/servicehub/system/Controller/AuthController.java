package servicehub.system.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import servicehub.system.DTO.AuthRequest;
import servicehub.system.DTO.AuthRespons;
import servicehub.system.DTO.RegisterRequest;
import servicehub.system.Service.AuthService;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthRespons> register(@RequestBody RegisterRequest request) {
        try {
            AuthRespons response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthRespons> login(@RequestBody AuthRequest request) {
        try {
            AuthRespons response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        return ResponseEntity.ok(authService.validateToken(jwt));
    }

    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        if (authService.validateToken(jwt)) {
            return ResponseEntity.ok(authService.getEmailFromToken(jwt));
        }
        return ResponseEntity.status(401).build();
    }
}

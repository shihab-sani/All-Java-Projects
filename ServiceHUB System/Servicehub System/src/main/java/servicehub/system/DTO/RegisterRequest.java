package servicehub.system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import servicehub.system.Entity.User;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private User.UserType userType;

    // For Worker Profile
    private String serviceCategory;
    private BigDecimal hourlyRate;
    private String bio;
    private String skills;
    private Integer yearsOfExperience;

    // For Customer Profile
    private String address;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;

    // For Admin Profile
    private String department;
    private String adminKey;
}

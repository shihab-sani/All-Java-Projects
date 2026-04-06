package servicehub.system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import servicehub.system.Entity.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRespons {
    private String token;
    private String refreshToken;
    private UserDTO user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private User.UserType userType;
        private Boolean isActive;
        private Boolean isBlocked;

        public static UserDTO fromUser(User user) {
            return new UserDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getIsActive(),
                    user.getIsBlocked()
            );
        }
    }
}

package servicehub.system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import servicehub.system.Entity.WorkerProfile;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkerProfileDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String profilePictureUrl;
    private String bio;
    private String serviceCategory;
    private BigDecimal hourlyRate;
    private String address;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Boolean isAvailable;
    private Integer totalJobs;
    private BigDecimal totalHoursWorked;
    private BigDecimal averageRating;
    private Boolean verified;
    private String skills;
    private Integer yearsOfExperience;

    public static WorkerProfileDTO fromWorkerProfile(WorkerProfile profile) {
        WorkerProfileDTO dto = new WorkerProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setFirstName(profile.getUser().getFirstName());
        dto.setLastName(profile.getUser().getLastName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhoneNumber(profile.getUser().getPhoneNumber());
        dto.setProfilePictureUrl(profile.getUser().getProfilePictureUrl());
        dto.setBio(profile.getBio());
        dto.setServiceCategory(profile.getServiceCategory());
        dto.setHourlyRate(profile.getHourlyRate());
        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setLatitude(profile.getLatitude());
        dto.setLongitude(profile.getLongitude());
        dto.setIsAvailable(profile.getIsAvailable());
        dto.setTotalJobs(profile.getTotalJobs());
        dto.setTotalHoursWorked(profile.getTotalHoursWorked());
        dto.setAverageRating(profile.getAverageRating());
        dto.setVerified(profile.getVerified());
        dto.setSkills(profile.getSkills());
        dto.setYearsOfExperience(profile.getYearsOfExperience());
        return dto;
    }
}

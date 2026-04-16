package servicehub.system.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import servicehub.system.DTO.WorkerProfileDTO;
import servicehub.system.Entity.WorkerProfile;
import servicehub.system.Repository.WorkerRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerService {
    private final WorkerRepository workerProfileRepository;

    public List<WorkerProfileDTO> findWorkersByCategory(String serviceCategory) {
        return workerProfileRepository.findByServiceCategoryAndIsAvailableTrue(serviceCategory)
                .stream()
                .map(WorkerProfileDTO::fromWorkerProfile)
                .collect(Collectors.toList());
    }

    public List<WorkerProfileDTO> findWorkersByCity(String city) {
        return workerProfileRepository.findByCity(city)
                .stream()
                .filter(WorkerProfile::getIsAvailable)
                .map(WorkerProfileDTO::fromWorkerProfile)
                .collect(Collectors.toList());
    }

    public List<WorkerProfileDTO> findNearbyWorkers(String serviceCategory, String city) {
        return workerProfileRepository.findNearbyWorkers(serviceCategory, city)
                .stream()
                .map(WorkerProfileDTO::fromWorkerProfile)
                .collect(Collectors.toList());
    }

    public List<WorkerProfileDTO> searchWorkers(String serviceCategory, BigDecimal latitude,
                                                BigDecimal longitude, double radiusKm) {
        return workerProfileRepository.findWorkersByGeolocation(latitude, longitude, radiusKm)
                .stream()
                .filter(wp -> serviceCategory == null || wp.getServiceCategory().equals(serviceCategory))
                .map(WorkerProfileDTO::fromWorkerProfile)
                .collect(Collectors.toList());
    }

    public WorkerProfileDTO getWorkerProfile(Long workerId) {
        WorkerProfile profile = workerProfileRepository.findByUserId(workerId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        return WorkerProfileDTO.fromWorkerProfile(profile);
    }

    public List<WorkerProfileDTO> getVerifiedWorkers() {
        return workerProfileRepository.findByVerifiedTrue()
                .stream()
                .map(WorkerProfileDTO::fromWorkerProfile)
                .collect(Collectors.toList());
    }

    public void updateWorkerAvailability(Long workerId, Boolean isAvailable) {
        WorkerProfile profile = workerProfileRepository.findByUserId(workerId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        profile.setIsAvailable(isAvailable);
        workerProfileRepository.save(profile);
        log.info("Worker {} availability updated to {}", workerId, isAvailable);
    }

    public void updateWorkerHourlyRate(Long workerId, BigDecimal hourlyRate) {
        WorkerProfile profile = workerProfileRepository.findByUserId(workerId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        profile.setHourlyRate(hourlyRate);
        workerProfileRepository.save(profile);
        log.info("Worker {} hourly rate updated to {}", workerId, hourlyRate);
    }
}

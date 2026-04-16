package servicehub.system.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import servicehub.system.DTO.WorkerProfileDTO;
import servicehub.system.Service.WorkerService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/worker")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class WorkerController {
    private final WorkerService workerService;

    @GetMapping("/category/{category}")
    public ResponseEntity<List<WorkerProfileDTO>> getWorkersByCategory(
            @PathVariable String category) {
        List<WorkerProfileDTO> workers = workerService.findWorkersByCategory(category);
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<WorkerProfileDTO>> getWorkersByCity(
            @PathVariable String city) {
        List<WorkerProfileDTO> workers = workerService.findWorkersByCity(city);
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<WorkerProfileDTO>> getNearbyWorkers(
            @RequestParam String serviceCategory,
            @RequestParam String city) {
        List<WorkerProfileDTO> workers = workerService.findNearbyWorkers(serviceCategory, city);
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<WorkerProfileDTO>> searchWorkers(
            @RequestParam(required = false) String serviceCategory,
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude,
            @RequestParam(defaultValue = "10") double radiusKm) {
        List<WorkerProfileDTO> workers = workerService.searchWorkers(serviceCategory, latitude, longitude, radiusKm);
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/{workerId}")
    public ResponseEntity<WorkerProfileDTO> getWorkerProfile(
            @PathVariable Long workerId) {
        WorkerProfileDTO worker = workerService.getWorkerProfile(workerId);
        return ResponseEntity.ok(worker);
    }

    @GetMapping("/verified")
    public ResponseEntity<List<WorkerProfileDTO>> getVerifiedWorkers() {
        List<WorkerProfileDTO> workers = workerService.getVerifiedWorkers();
        return ResponseEntity.ok(workers);
    }

    @PutMapping("/{workerId}/availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable Long workerId,
            @RequestParam Boolean isAvailable) {
        workerService.updateWorkerAvailability(workerId, isAvailable);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{workerId}/hourly-rate")
    public ResponseEntity<Void> updateHourlyRate(
            @PathVariable Long workerId,
            @RequestParam BigDecimal hourlyRate) {
        workerService.updateWorkerHourlyRate(workerId, hourlyRate);
        return ResponseEntity.ok().build();
    }
}

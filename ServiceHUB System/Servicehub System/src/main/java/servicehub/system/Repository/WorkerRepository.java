package servicehub.system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import servicehub.system.Entity.WorkerProfile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByUserId(Long userId);
    List<WorkerProfile> findByServiceCategory(String serviceCategory);
    List<WorkerProfile> findByCity(String city);
    List<WorkerProfile> findByIsAvailableTrue();
    List<WorkerProfile> findByServiceCategoryAndIsAvailableTrue(String serviceCategory);
    List<WorkerProfile> findByVerifiedTrue();

    @Query("""
        SELECT wp FROM WorkerProfile wp
        WHERE wp.isAvailable = true
        AND wp.serviceCategory = :serviceCategory
        AND (:city IS NULL OR wp.city = :city)
    """)
    List<WorkerProfile> findNearbyWorkers(@Param("serviceCategory") String serviceCategory,
                                          @Param("city") String city);

    @Query("""
        SELECT wp FROM WorkerProfile wp
        WHERE wp.isAvailable = true 
        AND (6371 * acos(cos(radians(:latitude)) * cos(radians(wp.latitude)) * 
             cos(radians(wp.longitude) - radians(:longitude)) + 
             sin(radians(:latitude)) * sin(radians(wp.latitude)))) <= :radiusKm
    """)
    List<WorkerProfile> findWorkersByGeolocation(
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radiusKm") double radiusKm
    );
}

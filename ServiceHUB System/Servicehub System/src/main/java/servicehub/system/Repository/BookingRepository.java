package servicehub.system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import servicehub.system.Entity.Booking;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByWorkerId(Long workerId);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByStatus(String status);
    List<Booking> findByWorkerIdAndStatus(Long workerId, Booking.BookingStatus status);
    List<Booking> findByCustomerIdAndStatus(Long customerId, Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findCustomerBookingHistory(@Param("customerId") Long customerId);

    @Query("SELECT b FROM Booking b WHERE b.worker.id = :workerId ORDER BY b.createdAt DESC")
    List<Booking> findWorkerBookingHistory(@Param("workerId") Long workerId);
}

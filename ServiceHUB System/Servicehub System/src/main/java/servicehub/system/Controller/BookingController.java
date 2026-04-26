package servicehub.system.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import servicehub.system.Entity.Booking;
import servicehub.system.Service.BookingService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long customerId,
            @RequestParam Long workerId,
            @RequestParam String serviceCategory,
            @RequestParam String jobDescription,
            @RequestParam BigDecimal hourlyRate,
            @RequestParam BigDecimal estimatedHours,
            @RequestParam LocalDateTime scheduledDate) {
        Booking booking = bookingService.createBooking(customerId, workerId, serviceCategory,
                jobDescription, hourlyRate, estimatedHours, scheduledDate);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingDetails(
            @PathVariable Long bookingId) {
        Booking booking = bookingService.getBookingDetails(bookingId);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(
            @PathVariable Long customerId) {
        List<Booking> bookings = bookingService.getCustomerBookings(customerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Booking>> getWorkerBookings(
            @PathVariable Long workerId) {
        List<Booking> bookings = bookingService.getWorkerBookings(workerId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<Void> acceptBooking(
            @PathVariable Long bookingId) {
        bookingService.acceptBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/start")
    public ResponseEntity<Void> startBooking(
            @PathVariable Long bookingId) {
        bookingService.startBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<Void> completeBooking(
            @PathVariable Long bookingId,
            @RequestParam BigDecimal actualHours) {
        bookingService.completeBooking(bookingId, actualHours);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{bookingId}/review")
    public ResponseEntity<Void> addReview(
            @PathVariable Long bookingId,
            @RequestParam Long reviewerId,
            @RequestParam Integer rating,
            @RequestParam String review) {
        bookingService.addReview(bookingId, reviewerId, rating, review);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{bookingId}/pay")
    public ResponseEntity<Void> markAsPaid(
            @PathVariable Long bookingId) {
        bookingService.markAsPaid(bookingId);
        return ResponseEntity.ok().build();
    }
}

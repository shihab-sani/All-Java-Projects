package servicehub.system.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import servicehub.system.Entity.Booking;
import servicehub.system.Entity.User;
import servicehub.system.Repository.BookingRepository;
import servicehub.system.Repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(Long customerId, Long workerId, String serviceCategory,
                                 String jobDescription, BigDecimal hourlyRate,
                                 BigDecimal estimatedHours, LocalDateTime scheduledDate) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        BigDecimal totalCost = hourlyRate.multiply(estimatedHours);

        Booking booking = Booking.builder()
                .customer(customer)
                .worker(worker)
                .serviceCategory(serviceCategory)
                .jobDescription(jobDescription)
                .hourlyRate(hourlyRate)
                .estimatedHours(estimatedHours)
                .totalCost(totalCost)
                .status(Booking.BookingStatus.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .scheduledDate(scheduledDate)
                .build();

        booking = bookingRepository.save(booking);
        log.info("Booking created: {} by customer {} for worker {}", booking.getId(), customerId, workerId);
        return booking;
    }

    @Transactional
    public void acceptBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.ACCEPTED);
        bookingRepository.save(booking);
        log.info("Booking {} accepted", bookingId);
    }

    @Transactional
    public void startBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.IN_PROGRESS);
        booking.setStartTime(LocalDateTime.now());
        bookingRepository.save(booking);
        log.info("Booking {} started", bookingId);
    }

    @Transactional
    public void completeBooking(Long bookingId, BigDecimal actualHours) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        booking.setEndTime(LocalDateTime.now());
        booking.setActualHoursWorked(actualHours);
        booking.setTotalCost(booking.getHourlyRate().multiply(actualHours));
        bookingRepository.save(booking);
        log.info("Booking {} completed", bookingId);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Booking {} cancelled", bookingId);
    }

    public Booking getBookingDetails(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findCustomerBookingHistory(customerId);
    }

    public List<Booking> getWorkerBookings(Long workerId) {
        return bookingRepository.findWorkerBookingHistory(workerId);
    }

    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    @Transactional
    public void addReview(Long bookingId, Long reviewerId, Integer rating, String review) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getCustomer().getId().equals(reviewerId)) {
            booking.setCustomerRating(rating);
            booking.setCustomerReview(review);
        } else if (booking.getWorker().getId().equals(reviewerId)) {
            booking.setWorkerRating(rating);
            booking.setWorkerReview(review);
        } else {
            throw new RuntimeException("Reviewer not associated with this booking");
        }

        bookingRepository.save(booking);
        log.info("Review added to booking {}", bookingId);
    }

    @Transactional
    public void markAsPaid(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        bookingRepository.save(booking);
        log.info("Booking {} marked as paid", bookingId);
    }
}

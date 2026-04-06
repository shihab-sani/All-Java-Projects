package servicehub.system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import servicehub.system.Entity.Conversations;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationsRepository extends JpaRepository<Conversations, Long> {
    Optional<Conversations> findByCustomerIdAndWorkerId(Long customerId, Long workerId);
    List<Conversations> findByCustomerId(Long customerId);
    List<Conversations> findByWorkerId(Long workerId);
    List<Conversations> findByCustomerIdAndIsActiveTrue(Long customerId);
    List<Conversations> findByWorkerIdAndIsActiveTrue(Long workerId);
}

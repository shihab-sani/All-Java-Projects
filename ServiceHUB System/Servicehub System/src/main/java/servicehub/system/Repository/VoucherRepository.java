package servicehub.system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import servicehub.system.Entity.Voucher;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByCode(String code);
    List<Voucher> findByIsActiveTrue();
    List<Voucher> findByCreatedById(Long createdById);
    List<Voucher> findByIsActive(boolean isActive);
    long countByIsActive(boolean isActive);
}

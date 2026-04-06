package servicehub.system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import servicehub.system.Entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByIdAndUserType(Long id, User.UserType userType);
    List<User> findByEmailContaining(String email);
    long countByIsBlocked(boolean isBlocked);
}

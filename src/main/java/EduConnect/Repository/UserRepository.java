package EduConnect.Repository;

import EduConnect.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    User findByEmail(String email);
    User findByEmailAndRefreshToken(String email, String refreshToken);
    User save(User user);
    void deleteById(long id);
    User findById(long id);
    User findByFullname(String username);
}

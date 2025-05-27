package EduConnect.Repository;

import EduConnect.Domain.ListeningGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListeningGroupRepository extends JpaRepository<ListeningGroup, Long> {
    ListeningGroup save(ListeningGroup repository);
}

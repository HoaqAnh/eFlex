package EduConnect.Repository;

import EduConnect.Domain.HistoryLearn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistoryLearnRepository extends JpaRepository<HistoryLearn, Integer> {

    Optional<HistoryLearn> findByNguoiDung_IdAndCourse_Id(Long userId, Long courseId);
}
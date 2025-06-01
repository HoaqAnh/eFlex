package EduConnect.Repository;

import EduConnect.Domain.HistoryTestExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryTestExerciseRepository extends JpaRepository<HistoryTestExercise, Integer> {
    List<HistoryTestExercise> findByUserIdAndTestExercise_Id(Long userId, Long testId);
}

package EduConnect.Repository;

import EduConnect.Domain.HistoryTestExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryTestExerciseRepository extends JpaRepository<HistoryTestExercise, Integer> {

}

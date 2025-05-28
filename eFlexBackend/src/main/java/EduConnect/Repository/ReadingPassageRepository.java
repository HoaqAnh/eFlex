package EduConnect.Repository;

import EduConnect.Domain.ReadingPassage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingPassageRepository extends JpaRepository<ReadingPassage, Long> {
    List<ReadingPassage> findByTestExerciseId(long idExercise);
}

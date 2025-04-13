package EduConnect.Repository;

import EduConnect.Domain.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    @Query("SELECT COUNT(bt) FROM Exercise bt WHERE bt.lesson.id IN " +
            "(SELECT bh.id FROM Lesson bh WHERE bh.course.id = :idCourse)")
    long countExerciseByCourseId(@Param("idCourse") long idCourse);
}

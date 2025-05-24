package EduConnect.Repository;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.TestExercise;
import EduConnect.Util.Enum.Dificulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    @Query("SELECT COUNT(bt) FROM TestExercise bt WHERE bt.lesson.id IN " +
            "(SELECT bh.id FROM Lesson bh WHERE bh.course.id = :idCourse)")
    long countExerciseByCourseId(@Param("idCourse") long idCourse);

    List<Exercise> findByTestExerciseId(Long testExerciseId);
    Page<Exercise> findByDificulty(Dificulty dificulty, Pageable pageable);
    void deleteById(Long id);
    boolean existsById(Long id);
    Page<Exercise> findAll(Pageable pageable);

    @Query("select e from Exercise e where e.testExercise.lesson.id = ?1")
    List<Exercise> findAllByLessonId(long lessonId);
    @Query("select t.testExercise from Exercise t where t.id = :exerciseId")
    TestExercise findExerciseById(Long exerciseId);

}
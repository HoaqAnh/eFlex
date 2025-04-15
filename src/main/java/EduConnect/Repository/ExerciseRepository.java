package EduConnect.Repository;

import EduConnect.Domain.Exercise;
import EduConnect.Util.Enum.Dificulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> { // Đổi Integer thành Long để khớp với id trong entity
    @Query("SELECT COUNT(bt) FROM Exercise bt WHERE bt.lesson.id IN " +
            "(SELECT bh.id FROM Lesson bh WHERE bh.course.id = :idCourse)")
    long countExerciseByCourseId(@Param("idCourse") long idCourse);

    Exercise findByLessonId(Long lessonId );

    Page<Exercise> findByDificulty(Dificulty dificulty, Pageable pageable);

    boolean existsById(Long id);
    Page<Exercise> findAll(Pageable pageable);
}
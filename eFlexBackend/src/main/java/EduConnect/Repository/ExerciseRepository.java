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

    @Query("select e from Exercise e where e.readingPassage.id = :readingPassageId")
    List<Exercise> findByReadingPassageId(Long readingPassageId);

    @Query("select e from Exercise e " +
            "where e.readingPassage.id = :readingPassageId " +
            "and e.testExercise.id = :testExerciseId")
    List<Exercise> findByReadingPassageIdEachTestExercise(Long readingPassageId, long testExerciseId);

    @Query(value = "SELECT * FROM  bai_tap e WHERE e.id_bkt IN :testExerciseIds ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Exercise> findRandomExercisesByTestExerciseIds(@Param("testExerciseIds") List<Long> testExerciseIds,
                                                        @Param("limit") int limit);

    @Query(value = "select * from bai_tap e where e.id_bkt = :testExercise ORDER BY RAND() LIMIT :limit ",nativeQuery = true)
    List<Exercise> RandomExercisesByTestExerciseIds(@Param("testExercise") long testExercise,
                                                    @Param("limit") int limit);
}
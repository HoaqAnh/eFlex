package EduConnect.Repository;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.TestExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestExerciseRepository extends JpaRepository<TestExercise, Integer> {
    TestExercise save(TestExercise testExercise);
    Optional<TestExercise> findById(long id);
    @Modifying
    @Query("delete from TestExercise T where T.id = ?1")
    void deleteById(long id);
    List<TestExercise> findByLessonId(long lessonId);
    TestExercise findByName(String name);
    @Query("select t.lesson from TestExercise t where t.id = :testExerciseId")
    Lesson findByTestExerciseId(long testExerciseId);
}

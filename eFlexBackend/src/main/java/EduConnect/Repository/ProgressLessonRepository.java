package EduConnect.Repository;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.ProgressLesson;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProgressLessonRepository extends CrudRepository<ProgressLesson, Integer> {
    @Query("SELECT COUNT(ps) FROM ProgressSection ps " +
            "WHERE ps.user.id = :userId " +
            "AND ps.section.lesson.id = :lessonId " +
            "AND ps.complete = true")
    long countByUserIdAndSectionLessonIdAndCompleteTrue(Long userId, Long lessonId);
    boolean existsByUserIdAndLessonId(long userId, long lessonId);

    @Query("select pr.lesson from ProgressLesson pr where pr.user.id = ?1")
    List<Lesson> findAllByUserId(long userId);

}

package EduConnect.Repository;

import EduConnect.Domain.ProgressLesson;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ProgressLessonRepository extends CrudRepository<ProgressLesson, Integer> {
    @Query("SELECT COUNT(ps) FROM ProgressSection ps " +
            "WHERE ps.user.id = :userId " +
            "AND ps.section.lesson.id = :lessonId " +
            "AND ps.complete = true")
    long countByUserIdAndSectionLessonIdAndCompleteTrue(Long userId, Long lessonId);
    boolean existsByUserIdAndLessonId(long userId, long lessonId);

}

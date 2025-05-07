package EduConnect.Repository;

import EduConnect.Domain.ProgressSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressSectionRepository extends JpaRepository<ProgressSection, Integer> {
    ProgressSection save(ProgressSection progressSection);
    @Query("SELECT COUNT(ps) FROM ProgressSection ps " +
            "WHERE ps.user.id = :userId " +
            "AND ps.section.lesson.id = :lessonId " +
            "AND ps.complete = true")
    long countByUserIdAndSectionLessonIdAndCompleteTrue(Long userId, Long lessonId);
    boolean existsByUser_IdAndSection_Id(long userId, long sectionId);
    ProgressSection findByUser_IdAndSection_Id(long userId, long sectionId);
}

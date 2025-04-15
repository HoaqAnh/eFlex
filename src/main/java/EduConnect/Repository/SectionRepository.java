package EduConnect.Repository;

import EduConnect.Domain.Section;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
    Optional<Section> findById(Long id);
    boolean existsById(Long id);
    void deleteById(Long id);
    Section findByLessonId(Long lessonId );
     Section save(Section section);
    @Query("SELECT MAX(l.viTri) FROM Section l WHERE l.lesson.id = ?1")
    Integer findMaxViTriBySectionId(long lessonId);
}

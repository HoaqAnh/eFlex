package EduConnect.Repository;

import EduConnect.Domain.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
     Section findByTenBai(String name);
     Section findById(long sectionId);
     Section save(Section section);
    @Query("SELECT MAX(l.viTri) FROM Section l WHERE l.lesson.id = ?1")
    Integer findMaxViTriBySectionId(long lessonId);
    void deleteById(long sectionId);
}

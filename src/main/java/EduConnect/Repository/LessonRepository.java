package EduConnect.Repository;

import EduConnect.Domain.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> , JpaSpecificationExecutor<Lesson> {
    Lesson save(Lesson lesson);
    Lesson getLessonById(long id);
    @Query("select T.id from Lesson T where T.id=?1")
    long findLessonByLessonId(long id);
    Optional<Lesson> findById(long id);
    Page<Lesson> findAll(Pageable pageable);
    @Query("select T from Lesson T where T.course.id = ?1 order by T.viTri asc ")
    List<Lesson> findByLessByCourseId(long idCourse);
    long countLessonByCourseId(long idCourse);
    boolean existsByCourse_IdAndViTri(Long courseId, int viTri);
    @Query("SELECT MAX(l.viTri) FROM Lesson l WHERE l.course.id = ?1")
    Integer findMaxViTriByCourseId(long courseId);


}

package EduConnect.Repository;

import EduConnect.Domain.Course;
import EduConnect.Domain.TienDo;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TienDoRepository extends JpaRepository<TienDo, Integer> , JpaSpecificationExecutor<TienDo> {
    TienDo findById(long id);

    @Modifying
    @Query("delete from TienDo T where T.course.id = ?1")
    void deleteByCourse(Long idCourse);
    @Query("select count(T) from TienDo T where T.course.id = ?1")
    long countByCourse(long idCourse);

    TienDo findByNguoiDung_IdAndCourse_Id(long idNguoiDung, long idCourse);

    @Query("select T.course from TienDo T where T.nguoiDung.id = ?1")
    List<Course> findListCourseByUserId(long userId);

}

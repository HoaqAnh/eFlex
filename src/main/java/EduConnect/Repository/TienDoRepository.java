package EduConnect.Repository;

import EduConnect.Domain.TienDo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TienDoRepository extends JpaRepository<TienDo, Integer> , JpaSpecificationExecutor<TienDo> {
    TienDo findById(long id);

    @Modifying
    @Query("delete from TienDo T where T.course.id = ?1")
    void deleteByCourse(Long idCourse);
    @Query("select count(T) from TienDo T where T.course.id = ?1")
    long countByCourse(long idCourse);
}

package EduConnect.Repository;

import EduConnect.Domain.TienDo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TienDoRepository extends JpaRepository<TienDo, Integer> , JpaSpecificationExecutor<TienDo> {
    TienDo findById(long id);
    @Query("delete from TienDo T where T.course = ?1")
    TienDo deleteByCourse(long idCourse);
}

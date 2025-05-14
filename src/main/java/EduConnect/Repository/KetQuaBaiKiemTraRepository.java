package EduConnect.Repository;

import EduConnect.Domain.KetQuaBaiKiemTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface KetQuaBaiKiemTraRepository extends JpaRepository<KetQuaBaiKiemTra, Integer> {
    List<KetQuaBaiKiemTra> findByUserIdAndCourseId(Long userId, Long courseId);

}

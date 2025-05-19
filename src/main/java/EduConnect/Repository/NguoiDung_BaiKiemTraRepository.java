package EduConnect.Repository;

import EduConnect.Domain.NguoiDung_BaiKiemTra;
import EduConnect.Domain.TestExercise;
import EduConnect.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NguoiDung_BaiKiemTraRepository extends JpaRepository<NguoiDung_BaiKiemTra, Integer> {

    NguoiDung_BaiKiemTra findByUser_IdAndTestExercise_Id(Long userid, Long testexerciseid);

}

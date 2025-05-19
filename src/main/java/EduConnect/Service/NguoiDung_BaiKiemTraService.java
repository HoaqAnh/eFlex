package EduConnect.Service;

import EduConnect.Domain.NguoiDung_BaiKiemTra;
import EduConnect.Repository.NguoiDung_BaiKiemTraRepository;
import org.springframework.stereotype.Service;

@Service
public class NguoiDung_BaiKiemTraService {

    private final NguoiDung_BaiKiemTraRepository nguoiDungBaiKiemTraRepository;
    public NguoiDung_BaiKiemTraService(NguoiDung_BaiKiemTraRepository nguoiDungBaiKiemTraRepository) {
        this.nguoiDungBaiKiemTraRepository = nguoiDungBaiKiemTraRepository;
    }

    public NguoiDung_BaiKiemTra findByUserIdAndTestExerciseId(long userId, long testExerciseId) {
        return nguoiDungBaiKiemTraRepository.findByUser_IdAndTestExercise_Id(userId, testExerciseId);
    }

    public NguoiDung_BaiKiemTra addNguoiDung_BaiKiemTra(NguoiDung_BaiKiemTra nguoiDungBaiKiemTra) {
        return nguoiDungBaiKiemTraRepository.save(nguoiDungBaiKiemTra);
    }
}

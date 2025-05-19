package EduConnect.Controller.User;

import EduConnect.Domain.NguoiDung_BaiKiemTra;
import EduConnect.Service.NguoiDung_BaiKiemTraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class NguoiDung_BaiKiemTraController {

    public final NguoiDung_BaiKiemTraService nguoiDung_BaiKiemTraService;
    public NguoiDung_BaiKiemTraController(NguoiDung_BaiKiemTraService nguoiDung_BaiKiemTraService) {
        this.nguoiDung_BaiKiemTraService = nguoiDung_BaiKiemTraService;
    }

    @PostMapping("/HistoryTestExercise")
    public ResponseEntity<NguoiDung_BaiKiemTra> taoLichSuLamBai(@RequestBody NguoiDung_BaiKiemTra nguoiDung_BaiKiemTra) {
        return ResponseEntity.ok(nguoiDung_BaiKiemTraService.addNguoiDung_BaiKiemTra(nguoiDung_BaiKiemTra));
    }

}

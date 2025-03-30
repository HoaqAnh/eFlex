package EduConnect.Domain.Response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class LessonDTO {
    private long id;
    private String tenBai;
    private Instant ngayTao;
    private int viTri;

    public LessonDTO(long id, String tenBai, Instant ngayTao, int viTri) {
        this.id = id;
        this.tenBai = tenBai;
        this.ngayTao = ngayTao;
        this.viTri = viTri;
    }
}
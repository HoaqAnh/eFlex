package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "KetQua_BaiKiemTra")
@Getter
@Setter
public class KetQuaBaiKiemTra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "id_ng_dung")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_khoa_hoc")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "id_bai_kiem_tra")
    private TestExercise testExercise;

    @ManyToOne
    @JoinColumn(name = "id_bai_tap")
    private Exercise exerciseType;

    @Column(name = "dap_an_chon")
    private String dapAnChon;

    @Column(name = "dung_sai")
    private Boolean dungSai;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;
}
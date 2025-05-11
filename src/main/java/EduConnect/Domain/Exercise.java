package EduConnect.Domain;

import EduConnect.Util.Enum.AnswerCorrect;
import EduConnect.Util.Enum.Dificulty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@Table(name = "Bai_Tap")
@Entity
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String cauHoi;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String dapAn1;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String dapAn2;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String dapAn3;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String dapAn4;
    @Enumerated(EnumType.STRING)
    private AnswerCorrect dapAnDung;

    @Enumerated(EnumType.STRING)
    private Dificulty dificulty;

    private long Id_BaiHoc;

    @OneToMany(mappedBy = "exerciseType")
    private List<KetQuaBaiKiemTra> ketQuaBaiKiemTra;
    @ManyToOne
    @JoinColumn(name = "id_bkt")
    @JsonIgnore
    private TestExercise testExercise;

}

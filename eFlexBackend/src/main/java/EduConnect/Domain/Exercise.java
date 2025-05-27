package EduConnect.Domain;

import EduConnect.Util.Enum.AnswerCorrect;
import EduConnect.Util.Enum.Dificulty;
import EduConnect.Util.Enum.QuestionType;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;
    @ManyToOne
    @JoinColumn(name = "id_bkt")
    @JsonBackReference(value = "testExercise_exercise")
    private TestExercise testExercise;

    @ManyToOne
    @JoinColumn(name = "id_DoanVan")
    @JsonBackReference(value = "readingPass_exercise")
    private ReadingPassage readingPassage;

    @ManyToOne
    @JoinColumn(name = "id_NhomCauNghe")
    private ListeningGroup listeningGroup;
}

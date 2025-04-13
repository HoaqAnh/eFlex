package EduConnect.Domain;

import EduConnect.Util.Enum.Dificulty;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "Bai_Tap")
@Entity
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String CauHoi;

    @Enumerated(EnumType.STRING)
    private Dificulty dificulty;

    @ManyToOne
    @JoinColumn(name = "id_Lesson")
    private Lesson lesson;



}

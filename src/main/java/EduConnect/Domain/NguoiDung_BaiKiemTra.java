package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "NguoiDung_BaiKiemTra")
public class NguoiDung_BaiKiemTra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_NguoiDung",referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_BaiKiemTra",referencedColumnName = "id")
    private TestExercise testExercise;

}

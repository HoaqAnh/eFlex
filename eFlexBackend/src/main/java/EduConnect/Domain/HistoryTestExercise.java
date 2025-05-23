package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;


@Entity
@Table(name = "LichSu_BaiKiemTra")
@Getter
@Setter
public class HistoryTestExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private Instant ngayTao;

    @ManyToOne
    @JoinColumn(name = "id_User")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_bkt")
    @JsonIgnore
    private TestExercise testExercise;

    @PrePersist
    protected void onCreate() {
        ngayTao = Instant.now();
    }
}

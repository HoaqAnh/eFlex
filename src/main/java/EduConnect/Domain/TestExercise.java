package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "BaiKiemTra")
@Getter
@Setter
public class TestExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private Instant createdAt;

    private Integer duration;

    @OneToOne
    @JoinColumn(name = "id_BaiHoc")
    private Lesson lesson;

    @OneToMany(mappedBy = "testExercise")
    private List<Exercise> exerciseList;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
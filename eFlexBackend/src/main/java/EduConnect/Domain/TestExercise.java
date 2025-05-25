package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

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

    @ManyToOne
    @JoinColumn(name = "id_BaiHoc")
    @JsonBackReference(value = "lesson_testExercise")
    private Lesson lesson;

    @OneToMany(mappedBy = "testExercise", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "testExercise_exercise")
    private List<Exercise> exerciseList;

    @OneToMany(mappedBy = "testExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoryTestExercise> historyTestExercises;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
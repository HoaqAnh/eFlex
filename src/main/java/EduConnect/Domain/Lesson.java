package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Bai_Hoc")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String tenBai;
    private Instant ngayTao;
    private int viTri;
    @ManyToOne
    @JoinColumn(name = "id_Course")
    private Course course;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Section> sections = new ArrayList<>();

    @OneToMany(mappedBy = "lesson")
    private List<Exercise> exercises = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        ngayTao = Instant.now();
    }
}

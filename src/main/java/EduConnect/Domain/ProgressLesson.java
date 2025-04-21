package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "TienDo_BaiHoc")
public class ProgressLesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private boolean complete;
    private Instant completedAt;

    @ManyToOne
    @JoinColumn(name = "id_NguoiDung",referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_BaiHoc",referencedColumnName = "id")
    private Lesson lesson;

    @PrePersist
    protected void onCreate() {
        completedAt = Instant.now();
    }
}

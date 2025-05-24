package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;


@Getter
@Setter
@Entity
@Table(name = "TienDo_PhanHoc")
public class ProgressSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private boolean complete;

    @Column(name = "completed_at")
    private Instant completedAt;


    @ManyToOne
    @JoinColumn(name = "id_NguoiDung",referencedColumnName = "id")
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_PhanHoc",referencedColumnName = "id")
    @JsonBackReference
    private Section section;


    @PrePersist
    protected void onCreate() {
        completedAt = Instant.now();
    }

}

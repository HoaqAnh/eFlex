package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Phan_Hoc")
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String tenBai;
    private String moTa;
    private String video;
    private String file;
    private Instant ngayTao;

    @ManyToOne
    @JoinColumn(name = "id_BaiHoc")
    private Lesson lesson;

    @PrePersist
    protected void onCreate() {
        ngayTao = Instant.now();
    }
}

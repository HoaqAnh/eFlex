package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

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

    @Column(columnDefinition = "MEDIUMTEXT")
    private String moTa;
    private String video;
    private String file;
    private Instant ngayTao;
    private int viTri;
    @ManyToOne
    @JoinColumn(name = "id_BaiHoc")
    @JsonBackReference
    private Lesson lesson;

    @PrePersist
    protected void onCreate() {
        ngayTao = Instant.now();
    }
}

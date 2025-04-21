package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

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

    @OneToMany(mappedBy = "section")
    @JsonIgnore
    private List<ProgressSection> progressSections;


    @PrePersist
    protected void onCreate() {
        ngayTao = Instant.now();
    }
}

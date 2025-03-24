package EduConnect.Domain;

import EduConnect.Util.SecurityUtil;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "TienDo")
public class TienDo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_NguoiDung", referencedColumnName = "id")
    private User nguoiDung;

    @ManyToOne
    @JoinColumn(name = "id_course", referencedColumnName = "id")
    private Course course;

    @Column(name = "PhanTram")
    private int phanTram;

    @Column(name = "NgayCapNhat")
    private Instant ngayCapNhat;
    @PreUpdate
    public void BeforeUpdate() {
        this.ngayCapNhat = Instant.now();
    }
}
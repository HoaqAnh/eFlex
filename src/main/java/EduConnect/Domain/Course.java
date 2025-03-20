package EduConnect.Domain;

import EduConnect.Util.SecurityUtil;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "MonHoc")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "TenMon")
    private String tenMon;

    @Column(name = "MoTa")
    private String moTa;

    @Column(name = "NgayTao")
    private Instant ngayTao;

    @Column(name = "NgayCapNhat")
    private Instant ngayCapNhat;

    @Column(name = "id_DanhMuc")
    private long idDanhMuc;

    @OneToMany(mappedBy = "course")
    private List<TienDo> tienDoList;

    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void BeforeCreate() {
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get() : "";
        this.ngayTao = Instant.now();
    }

    @PreUpdate
    public void BeforeUpdate() {
        this.ngayCapNhat = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get() : "";
    }
}

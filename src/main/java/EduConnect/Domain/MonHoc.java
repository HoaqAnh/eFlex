package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "MonHoc")
public class MonHoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "TenMon")
    private String tenMon;

    @Column(name = "MoTa")
    private String moTa;

    @Column(name = "NgayTao")
    private String ngayTao;

    @Column(name = "NgayCapNhat")
    private String ngayCapNhat;

    @Column(name = "id_DanhMuc")
    private long idDanhMuc;

    @OneToMany(mappedBy = "monHoc")
    private List<TienDo> tienDoList;
}
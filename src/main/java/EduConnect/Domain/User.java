package EduConnect.Domain;

import EduConnect.Util.Enum.AuthProvider;
import EduConnect.Util.Enum.Education;
import EduConnect.Util.Enum.Enable;

import EduConnect.Util.SecurityUtil;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "NguoiDung")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String email;

    private String age;
    private String password;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    private String fullname;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @Enumerated(EnumType.STRING)
    private Enable enable;
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;
    @Enumerated(EnumType.STRING)
    private Education education;
//    @Enumerated(EnumType.STRING)
//    private AuthProvider provider;

    private String providerId;

    private String image_url;
    private String address;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "nguoiDung")
    private List<TienDo> tienDoList;
    @PrePersist
    public void BeforeCreate() {
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get() : "";
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void BeforeUpdate() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get() : "";
    }
}

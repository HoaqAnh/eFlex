package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "Role")
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String roleName;


    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "role")
    private List<User> users;

    @ManyToMany
    @JsonIgnoreProperties(value = {"roles"})
    @JoinTable(name = "permission_role",joinColumns = @JoinColumn(name = "role_id"),inverseJoinColumns = @JoinColumn(name = "permission_id"))
    private List<Permission> permissions;
}

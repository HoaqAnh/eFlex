package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Danh_Gia")
@Getter
@Setter
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int rating;

    @ManyToOne
    @JoinColumn(name = "id_NgDung")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_MonHoc")
    private Course course;
}

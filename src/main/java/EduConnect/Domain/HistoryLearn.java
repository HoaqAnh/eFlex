package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "lichsu_hoctap")
@Getter
@Setter
public class HistoryLearn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_NgDung", referencedColumnName = "id")
    private User nguoiDung;

    @ManyToOne
    @JoinColumn(name = "id_MonHoc", referencedColumnName = "id")
    private Course course;
    private LocalDateTime timestamp = LocalDateTime.now();
    private int duration =0;
    private int frequency=1;


}

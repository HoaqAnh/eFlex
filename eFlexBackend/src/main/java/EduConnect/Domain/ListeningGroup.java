package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "ListeningGroup")
@Getter
@Setter
public class ListeningGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "groupName")
    private String groupName;

    @Column(name = "audioFile")
    private String audioFile;

    @OneToMany(mappedBy = "listeningGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Exercise> questions;


}

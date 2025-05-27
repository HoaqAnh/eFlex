package EduConnect.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Doan_Van")
public class ReadingPassage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "readingPassage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Exercise> questions;

    @OneToMany(mappedBy = "readingPassage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<WordList> wordLists;


}

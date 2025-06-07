package EduConnect.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "WordList")
@Getter
@Setter
public class WordList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "word")
    private String word;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "readingPassageId", nullable = false)
    private ReadingPassage readingPassage;



}

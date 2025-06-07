package EduConnect.Domain.Response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestExerciseResponse {
    private long id;
    private String name;
    private Integer duration;
    private int totalQuestion;
}

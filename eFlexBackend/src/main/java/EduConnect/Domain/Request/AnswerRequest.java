package EduConnect.Domain.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequest {
    private long idExercise;
    private String answer;
}

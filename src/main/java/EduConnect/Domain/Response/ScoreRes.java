package EduConnect.Domain.Response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ScoreRes {
    private float score;
    private String message;
    private List<ExerciseResult> results;

    @Getter
    @Setter
    public static class ExerciseResult {
        private long exerciseId;
        private String userAnswer;
        private boolean isCorrect;
    }

}

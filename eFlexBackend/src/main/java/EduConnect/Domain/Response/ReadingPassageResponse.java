package EduConnect.Domain.Response;

import EduConnect.Util.Enum.AnswerCorrect;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReadingPassageResponse {
    private String title;
    private String content;
    private List<Exercise> exerciseList;

    @Getter
    @Setter
    public static class Exercise{
        private String cauHoi;
        private String dapAn1;
        private String dapAn2;
        private String dapAn3;
        private String dapAn4;
        private AnswerCorrect dapAnDung;
    }
}

package EduConnect.Domain.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseResponseDTO {
    private Map<String, ExerciseGroupDTO> data;

    @Getter
    @Setter
    public static class ExerciseGroupDTO {
        private String audioFile;
        private String nameGroup;
        private String title;
        private Long passageId;
        private List<ExerciseDTO> exercises = new ArrayList<>();


    }
    @Getter
    @Setter
    public static class ExerciseDTO {
        private Long id;
        private String cauHoi;
        private String dapAn1;
        private String dapAn2;
        private String dapAn3;
        private String dapAn4;
        private String dapAnDung;
        private String dificulty;
        private String questionType;

    }
}
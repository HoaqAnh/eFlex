package EduConnect.Domain.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionRequest {
    private Lesson lesson;
    private String moTa;
    private String tenBai;
    private String video;
    @Getter
    @Setter
    public static class Lesson {
        private long id;
    }
}

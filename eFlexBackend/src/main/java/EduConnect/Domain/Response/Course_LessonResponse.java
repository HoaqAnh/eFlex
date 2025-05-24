package EduConnect.Domain.Response;

import EduConnect.Domain.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course_LessonResponse {
    public Course course;
    @Getter
    @Setter
    public static class Course{
        private String name;
        private long id;
        private List<Lesson> lessonList;

        @Getter
        @Setter
        public static class Lesson{
            private String name;
            private long id;
            private boolean complete;
        }
    }



}

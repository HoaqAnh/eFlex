package EduConnect.Controller.Admin;

import EduConnect.Domain.Course;
import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.ExerciseResponseDTO;
import EduConnect.Domain.TestExercise;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.LessonRepository;
import EduConnect.Service.CourseService;
import EduConnect.Service.ExerciseService;
import EduConnect.Service.LessonService;
import EduConnect.Service.TestExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/test-exercises")
public class TestExerciseController {

    private final TestExerciseService testExerciseService;
    private final LessonRepository lessonRepository;
    private final ExerciseService exerciseService;
    private final CourseService courseService;

    @Autowired
    public TestExerciseController(TestExerciseService testExerciseService,
                                  LessonRepository lessonRepository,
                                  ExerciseService exerciseService,
                                  CourseService courseService) {
        this.testExerciseService = testExerciseService;
        this.lessonRepository = lessonRepository;
        this.exerciseService = exerciseService;
        this.courseService = courseService;
    }
    @PostMapping
    public ResponseEntity<TestExercise> createTestExercise(@RequestBody TestExercise testExercise) {
        TestExercise createdTestExercise = testExerciseService.createTestExercise(testExercise);
        return new ResponseEntity<>(createdTestExercise, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestExercise> updateTestExercise(@PathVariable Long id, @RequestBody TestExercise testExercise) {
        TestExercise updatedTestExercise = testExerciseService.updateTestExercise(id, testExercise);
        return new ResponseEntity<>(updatedTestExercise, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestExercise(@PathVariable Long id) {
        testExerciseService.deleteTestExercise(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTestExercise(@PathVariable Long id) {
        TestExercise testExercise = testExerciseService.getTestExerciseById(id);
        ExerciseResponseDTO responseDTO = exerciseService.getGroupedExercisesForTestExercise(id);

        Map<String, ExerciseResponseDTO.ExerciseGroupDTO> dataMap = responseDTO.getData();
        int totalQuestions = 0;
        for (ExerciseResponseDTO.ExerciseGroupDTO group : dataMap.values()) {
            totalQuestions += group.getExercises().size();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 200);
        response.put("message", "Call API SUCCESS");
        response.put("testExerciseId", id);
        response.put("name",testExercise.getName());
        response.put("totalQuestion", totalQuestions);
        response.put("duration", totalQuestions + 15);
        response.put("data", responseDTO.getData());
        return ResponseEntity.ok(response);

    }
    @GetMapping("/lesson/{idLesson}")
    public ResponseEntity<List<TestExercise>> getTestExerciseByLessonn(@PathVariable Long idLesson) {

        Lesson lesson=lessonRepository.getLessonById(idLesson);
        List<TestExercise> testExerciseList = this.testExerciseService.getTestByLesson(idLesson,lesson.getCourse().getTenMon());
        return ResponseEntity.ok(testExerciseList);
    }
    @GetMapping("/assessmentTest/{courseId}")
    public ResponseEntity<Map<String, Object>> getRandomTestExerciseByCourseId(@PathVariable Long courseId) {
        try {
            ExerciseResponseDTO responseDTO = courseService.createAssessmentTest(courseId);
            //Các bước lấy thông tin Test để trả cho Frontend
            Course course = courseService.findById(courseId);
            String nameTest = "Level Assessment Test " + course.getTenMon();
            TestExercise testExercise = testExerciseService.findByName(nameTest);
            Map<String, ExerciseResponseDTO.ExerciseGroupDTO> dataMap = responseDTO.getData();
            int totalQuestions = 0;
            for (ExerciseResponseDTO.ExerciseGroupDTO group : dataMap.values()) {
                totalQuestions += group.getExercises().size();
            }

            // Map data và return
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", 200);
            response.put("message", "Call API SUCCESS");
            response.put("TestExerciseId", testExercise.getId());
            response.put("name", testExercise.getName());
            response.put("totalQuestion", totalQuestions);
            response.put("duration", totalQuestions + 15);
            response.put("data", responseDTO.getData());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("statusCode", 500);
            errorResponse.put("error", "Lỗi khi tạo bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
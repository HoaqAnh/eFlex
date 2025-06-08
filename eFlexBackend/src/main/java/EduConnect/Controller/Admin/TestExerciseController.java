package EduConnect.Controller.Admin;

import EduConnect.Domain.Course;
import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.ExerciseResponseDTO;
import EduConnect.Domain.Response.TestExerciseResponse;
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

    @GetMapping("/lesson/{idLesson}")
    public ResponseEntity<List<TestExerciseResponse>> getTestExerciseByLessonn(@PathVariable Long idLesson) {
        Lesson lesson=lessonRepository.getLessonById(idLesson);
        List<TestExercise> testExerciseList = this.testExerciseService.getTestByLesson(idLesson,lesson.getCourse().getTenMon());
        List<TestExerciseResponse> responses = new ArrayList<>();
        for (TestExercise testExercise : testExerciseList) {
            TestExerciseResponse testExerciseResponse = new TestExerciseResponse();
            testExerciseResponse.setId(testExercise.getId());
            testExerciseResponse.setName(testExercise.getName());
            testExerciseResponse.setDuration(testExercise.getDuration());
            testExerciseResponse.setTotalQuestion(testExercise.getExerciseList().size() + lesson.getViTri()*3);
            responses.add(testExerciseResponse);
        }
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/assessmentTest/{courseId}")
    public ResponseEntity<Map<String, Object>> getRandomTestExerciseByCourseId(@PathVariable Long courseId) {
        try {
            ExerciseResponseDTO responseDTO = courseService.createAssessmentTest(courseId);
            Course course = courseService.findById(courseId);
            String nameTest = "Level Assessment Test " + course.getTenMon();
            TestExercise testExercise = testExerciseService.findByName(nameTest);
            Map<String, ExerciseResponseDTO.ExerciseGroupDTO> dataMap = responseDTO.getData();
            int totalQuestions = 0;
            for (ExerciseResponseDTO.ExerciseGroupDTO group : dataMap.values()) {
                totalQuestions += group.getExercises().size();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", 200);
            response.put("message", "Call API SUCCESS");
            response.put("data", responseDTO.getData());
            response.put("testExerciseId", testExercise.getId());
            response.put("TestExerciseName", testExercise.getName());
            response.put("totalQuestion", totalQuestions);
            response.put("duration", testExercise.getDuration());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("statusCode", 500);
            errorResponse.put("error", "Lỗi khi tạo bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
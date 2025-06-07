package EduConnect.Controller.User;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.HistoryLearn;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.TestExercise;
import EduConnect.Domain.User;
import EduConnect.Repository.TestExerciseRepository;
import EduConnect.Service.*;
import EduConnect.Util.Error.IdInValidException;
import EduConnect.Util.SecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HistoryLearnController {

    private final HistoryLearnService historyLearnService;
    private final UserService userService;
    private final RestTemplate restTemplate;
    private final LessonService lessonService;
    private final TestExerciseService testExerciseService;
    private final TestExerciseRepository testExerciseRepository;
    private final ExerciseService exerciseService;

    public HistoryLearnController(HistoryLearnService historyLearnService,
                                  UserService userService, RestTemplate restTemplate,
                                  LessonService lessonService, TestExerciseService testExerciseService,
                                  TestExerciseRepository testExerciseRepository, ExerciseService exerciseService) {
        this.historyLearnService = historyLearnService;
        this.userService = userService;
        this.restTemplate = restTemplate;
        this.lessonService = lessonService;
        this.testExerciseService = testExerciseService;
        this.testExerciseRepository = testExerciseRepository;
        this.exerciseService = exerciseService;
    }



    @PostMapping("/log_learning")
    public ResponseEntity<Void> logLearning(@RequestBody HistoryLearn historyLearn) {
        String email = SecurityUtil.getCurrentUserLogin().get();
        User user = this.userService.getUserByEmail(email);
        historyLearnService.logLearning(user, historyLearn.getCourse(), historyLearn.getDuration());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/recommend/{userId}")
    public ResponseEntity<Map<String, Object>> recommend(@PathVariable("userId") Integer userId) {
        try {
            String flaskApiUrl = "http://host.docker.internal:5000/recommend/" + userId;

            ResponseEntity<Map> response = restTemplate.getForEntity(flaskApiUrl, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(response.getBody());
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Không thể lấy danh sách môn học gợi ý từ Flask API");
                return ResponseEntity.status(response.getStatusCode()).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Lỗi khi gọi Flask API: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    @PostMapping("/submit-test/{userId}")
    public ResponseEntity<Map<String, Object>> submitTest(
            @PathVariable("userId") Long userId,
            @RequestBody List<AnswerRequest> answers) throws IdInValidException {
        try {
            Map<String, Object> recommendation = testExerciseService.submitTestAndRecommend(userId, answers);
            long idExercise = answers.get(0).getIdExercise();
            Exercise exercise = exerciseService.findById(idExercise);
            TestExercise testExercise = testExerciseService.getTestExerciseById(exercise.getTestExercise().getId());
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", 200);
            response.put("message", "Đã xử lý bài kiểm tra");
            response.put("lessonId", testExercise.getLesson().getId());
            response.put("recommendation", recommendation);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("statusCode", 500);
            errorResponse.put("error", "Lỗi khi xử lý bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
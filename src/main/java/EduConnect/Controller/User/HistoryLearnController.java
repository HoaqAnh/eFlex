package EduConnect.Controller.User;

import EduConnect.Domain.HistoryLearn;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.User;
import EduConnect.Service.HistoryLearnService;
import EduConnect.Service.LessonService;
import EduConnect.Service.TestExerciseService;
import EduConnect.Service.UserService;
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
    public HistoryLearnController(HistoryLearnService historyLearnService, UserService userService, RestTemplate restTemplate, LessonService lessonService, TestExerciseService testExerciseService) {
        this.historyLearnService = historyLearnService;
        this.userService = userService;
        this.restTemplate = restTemplate;
        this.lessonService = lessonService;
        this.testExerciseService = testExerciseService;
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
    @GetMapping("/recommend-lesson/{userId}/{courseId}")
    public ResponseEntity<Map<String, Object>> recommendLesson(@PathVariable("userId") Long userId, @PathVariable("courseId") Long courseId) {
        try {
            Map<String, Object> recommendation = lessonService.recommendNextLesson(userId, courseId);
            return ResponseEntity.ok(recommendation);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Lỗi khi gợi ý bài học: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    @PostMapping("/submit-test/{userId}/{testId}")
    public ResponseEntity<Map<String, Object>> submitTest(
            @PathVariable("userId") Long userId,
            @PathVariable("testId") Long testId,
            @RequestBody List<AnswerRequest> answers) {
        try {
            this.testExerciseService.submitTest(userId, testId, answers);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Kết quả bài kiểm tra đã được lưu");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Lỗi khi lưu kết quả bài kiểm tra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
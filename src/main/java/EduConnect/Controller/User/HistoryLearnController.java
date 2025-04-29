package EduConnect.Controller.User;

import EduConnect.Domain.HistoryLearn;
import EduConnect.Domain.User;
import EduConnect.Service.HistoryLearnService;
import EduConnect.Service.UserService;
import EduConnect.Util.SecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HistoryLearnController {

    private final HistoryLearnService historyLearnService;
    private final UserService userService;
    private final RestTemplate restTemplate;
    public HistoryLearnController(HistoryLearnService historyLearnService, UserService userService, RestTemplate restTemplate) {
        this.historyLearnService = historyLearnService;
        this.userService = userService;
        this.restTemplate = restTemplate;
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
            String flaskApiUrl = "http://localhost:5000/recommend/" + userId;
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
}
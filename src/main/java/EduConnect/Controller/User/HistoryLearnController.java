package EduConnect.Controller.User;

import EduConnect.Domain.HistoryLearn;
import EduConnect.Domain.User;
import EduConnect.Service.HistoryLearnService;
import EduConnect.Service.UserService;
import EduConnect.Util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HistoryLearnController {

    private final HistoryLearnService historyLearnService;
    private final UserService userService;
    public HistoryLearnController(HistoryLearnService historyLearnService, UserService userService) {
        this.historyLearnService = historyLearnService;
        this.userService = userService;
    }
    @PostMapping("/log_learning")
    public ResponseEntity<Void> logLearning(@RequestBody HistoryLearn historyLearn) {
            String email= SecurityUtil.getCurrentUserLogin().get();
            User user=this.userService.getUserByEmail(email);
            historyLearnService.logLearning(user, historyLearn.getCourse(), historyLearn.getDuration());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        }
    }

package EduConnect.Controller.User;

import EduConnect.Service.ProgressService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ProgressLessonController {
    private final ProgressService progressService;
    public ProgressLessonController(ProgressService progressService) {
        this.progressService = progressService;
    }

}

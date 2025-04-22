package EduConnect.Controller.User;

import EduConnect.Domain.Assessment;
import EduConnect.Service.AssessmentService;
import EduConnect.Util.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AssessmentController {
    private final AssessmentService assessmentService;
    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }
    @PostMapping("/assessment")
    @ApiMessage("Create a assessment")
    public ResponseEntity<Assessment> createAssessment(@RequestBody Assessment assessment) {
        return ResponseEntity.ok(this.assessmentService.Create(assessment));
    }
}

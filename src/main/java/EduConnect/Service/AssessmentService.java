package EduConnect.Service;

import EduConnect.Domain.Assessment;
import EduConnect.Repository.AssessmentRepository;
import org.springframework.stereotype.Service;

@Service
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    public AssessmentService(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }
    public Assessment Create(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }
}


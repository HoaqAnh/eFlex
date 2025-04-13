package EduConnect.Service;

import EduConnect.Repository.ExerciseRepository;
import org.springframework.stereotype.Service;

@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }
    public long countExerciseByCourse(long idCourse) {
        return this.exerciseRepository.countExerciseByCourseId(idCourse);
    }
}

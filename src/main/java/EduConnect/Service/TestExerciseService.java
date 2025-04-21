package EduConnect.Service;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.TestExercise;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.TestExerciseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TestExerciseService {
    private final TestExerciseRepository testExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    public TestExerciseService(TestExerciseRepository testExerciseRepository, ExerciseRepository exerciseRepository) {
        this.testExerciseRepository = testExerciseRepository;
        this.exerciseRepository = exerciseRepository;
    }
    @Transactional
    public TestExercise createTestExercise(TestExercise testExercise) {
        return testExerciseRepository.save(testExercise);
    }
    @Transactional
    public TestExercise updateTestExercise(Long id, TestExercise updatedTestExercise) {
        TestExercise existingTestExercise = testExerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại: " + id));

        existingTestExercise.setName(updatedTestExercise.getName());
        existingTestExercise.setDuration(updatedTestExercise.getDuration());
        existingTestExercise.setLesson(updatedTestExercise.getLesson());


        return testExerciseRepository.save(existingTestExercise);
    }
    @Transactional
    public void deleteTestExercise(Long id) {
        TestExercise testExercise = testExerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại: " + id));

        if (testExercise.getExerciseList() != null) {
            for(Exercise exercise : testExercise.getExerciseList()) {
                this.exerciseRepository.deleteById(exercise.getId());
            }
        }

        testExerciseRepository.deleteById(id);
    }

    public TestExercise getTestExerciseById(Long id) {
        return testExerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại: " + id));
    }
}
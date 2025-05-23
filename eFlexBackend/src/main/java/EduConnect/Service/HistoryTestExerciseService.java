package EduConnect.Service;

import EduConnect.Domain.HistoryTestExercise;
import EduConnect.Domain.TestExercise;
import EduConnect.Domain.User;
import EduConnect.Repository.HistoryTestExerciseRepository;
import org.springframework.stereotype.Service;

@Service
public class HistoryTestExerciseService {
    private final HistoryTestExerciseRepository testExerciseRepository;
    public HistoryTestExerciseService(HistoryTestExerciseRepository testExerciseRepository) {
        this.testExerciseRepository = testExerciseRepository;
    }
    public void createNewHistoryTestExercise(User user, TestExercise testExercise) {
        HistoryTestExercise historyTestExercise = new HistoryTestExercise();
        historyTestExercise.setUser(user);
        historyTestExercise.setTestExercise(testExercise);
        testExerciseRepository.save(historyTestExercise);
    }
}

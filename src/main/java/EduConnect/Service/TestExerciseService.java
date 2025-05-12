package EduConnect.Service;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.KetQuaBaiKiemTra;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.TestExercise;
import EduConnect.Domain.User;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.KetQuaBaiKiemTraRepository;
import EduConnect.Repository.TestExerciseRepository;
import EduConnect.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TestExerciseService {
    private final TestExerciseRepository testExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final KetQuaBaiKiemTraRepository ketQuaBaiKiemTraRepository;
    private final UserRepository userRepository;

    public TestExerciseService(TestExerciseRepository testExerciseRepository, ExerciseRepository exerciseRepository,
                               KetQuaBaiKiemTraRepository ketQuaBaiKiemTraRepository,
                               UserRepository userRepository) {
        this.testExerciseRepository = testExerciseRepository;
        this.exerciseRepository = exerciseRepository;
        this.ketQuaBaiKiemTraRepository = ketQuaBaiKiemTraRepository;
        this.userRepository = userRepository;
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
        Optional<TestExercise> optional = testExerciseRepository.findById(id);

        if (optional.isPresent()) {
            TestExercise test = optional.get();

            test.getExerciseList().clear();

            testExerciseRepository.delete(test);
        } else {
            throw new RuntimeException("TestExercise id " + id + " doesn't exist");
        }
    }
    public List<TestExercise>  getTestByLesson(Long lessonId) {
        return this.testExerciseRepository.findByLessonId(lessonId);
    }
    public TestExercise getTestExerciseById(Long id) {
        return testExerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại: " + id));
    }
    public void submitTest(Long userId, Long testId, List<AnswerRequest> answers) {
        // Kiểm tra bài kiểm tra có tồn tại không
        TestExercise test = testExerciseRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài kiểm tra"));
        User user = this.userRepository.findById(userId);
        // Lưu kết quả làm bài kiểm tra
        for (AnswerRequest answer : answers) {
            Long exerciseId = answer.getIdExercise();

            String selectedAnswer = answer.getAnswer();

            // Kiểm tra câu hỏi có tồn tại không
            Exercise exercise = exerciseRepository.findById(exerciseId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi"));

            // Kiểm tra đáp án chọn có đúng không
            boolean isCorrect = selectedAnswer.equals(exercise.getDapAnDung().toString());

            // Lưu kết quả
            KetQuaBaiKiemTra result = new KetQuaBaiKiemTra();
            result.setUser(user);
            result.setTestExercise(test);
            result.setExerciseType(exercise);
            result.setDapAnChon(selectedAnswer);
            result.setDungSai(isCorrect);
            result.setTimestamp(LocalDateTime.now());

            ketQuaBaiKiemTraRepository.save(result);
        }
    }
}
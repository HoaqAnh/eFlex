package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TestExerciseService {
    private final TestExerciseRepository testExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final KetQuaBaiKiemTraRepository ketQuaBaiKiemTraRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public TestExerciseService(TestExerciseRepository testExerciseRepository, ExerciseRepository exerciseRepository,
                               KetQuaBaiKiemTraRepository ketQuaBaiKiemTraRepository,
                               UserRepository userRepository, LessonRepository lessonRepository) {
        this.testExerciseRepository = testExerciseRepository;
        this.exerciseRepository = exerciseRepository;
        this.ketQuaBaiKiemTraRepository = ketQuaBaiKiemTraRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
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
    public Map<String, Object> submitTestAndRecommend(Long userId, Long testId, List<AnswerRequest> answers) {
        TestExercise test = testExerciseRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài kiểm tra"));

        double currentTestCorrectRate = calculateCurrentTestCorrectRate(answers);

        Lesson currentLesson = test.getLesson();
        Long courseId = currentLesson.getCourse().getId();
        int latestLessonOrder = currentLesson.getViTri();

        Map<Long, Double> previousLessonsPerformance = new HashMap<>();
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        lessons.sort((l1, l2) -> Integer.compare(l1.getViTri(), l2.getViTri()));

        for (int order = 1; order < latestLessonOrder; order++) {
            int lessonOrder = order;
            Lesson previousLesson = lessons.stream()
                    .filter(lesson -> lesson.getViTri() == lessonOrder)
                    .findFirst()
                    .orElse(null);

            if (previousLesson != null) {
                double correctRate = calculatePreviousLessonCorrectRate(answers, previousLesson.getId());
                previousLessonsPerformance.put(previousLesson.getId(), correctRate);
            }
        }

        if (currentTestCorrectRate < 0.8) {
            return createRecommendation(currentLesson, "Ôn lại " + currentLesson.getTenBai());
        }

        for (Map.Entry<Long, Double> entry : previousLessonsPerformance.entrySet()) {
            if (entry.getValue() < 0.8) {
                Lesson lessonToReview = lessonRepository.findById(entry.getKey()).orElse(null);
                if (lessonToReview != null) {
                    return createRecommendation(lessonToReview, "Ôn lại " + lessonToReview.getTenBai());
                }
            }
        }

        return recommendNextLessonAfterCurrent(lessons, latestLessonOrder);
    }

    private double calculateCurrentTestCorrectRate(List<AnswerRequest> answers) {
        if (answers.isEmpty()) return 1.0;
        long correctAnswers = answers.stream()
                .filter(answer -> {
                    Exercise exercise = exerciseRepository.findById(answer.getIdExercise())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi"));
                    return answer.getAnswer().equals(exercise.getDapAnDung().toString());
                })
                .count();
        return (double) correctAnswers / answers.size();
    }

    private double calculatePreviousLessonCorrectRate(List<AnswerRequest> answers, Long previousLessonId) {
        List<AnswerRequest> previousLessonAnswers = answers.stream()
                .filter(answer -> {
                    Exercise exercise = exerciseRepository.findById(answer.getIdExercise())
                            .orElse(null);
                    return exercise != null && exercise.getId_BaiHoc() == previousLessonId;
                })
                .collect(Collectors.toList());

        if (previousLessonAnswers.isEmpty()) return 1.0;

        long correctAnswers = previousLessonAnswers.stream()
                .filter(answer -> {
                    Exercise exercise = exerciseRepository.findById(answer.getIdExercise())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi"));
                    return answer.getAnswer().equals(exercise.getDapAnDung().toString());
                })
                .count();
        return (double) correctAnswers / previousLessonAnswers.size();
    }

    private Map<String, Object> recommendNextLessonAfterCurrent(List<Lesson> lessons, int latestLessonOrder) {
        int nextLessonOrder = latestLessonOrder + 1;
        Lesson nextLesson = lessons.stream()
                .filter(lesson -> lesson.getViTri() == nextLessonOrder)
                .findFirst()
                .orElse(null);

        if (nextLesson != null) {
            return createRecommendation(nextLesson, "Tiếp tục học " + nextLesson.getTenBai());
        } else {
            return createRecommendation(lessons.get(lessons.size() - 1), "Bạn đã hoàn thành tất cả bài học. Ôn lại " + lessons.get(lessons.size() - 1).getTenBai());
        }
    }

    private Map<String, Object> createRecommendation(Lesson lesson, String message) {
        Map<String, Object> recommendation = new HashMap<>();
        recommendation.put("lesson_id", lesson.getId());
        recommendation.put("ten_bai_hoc", lesson.getTenBai());
        recommendation.put("vi_tri", lesson.getViTri());
        recommendation.put("message", message);
        return recommendation;
    }

}
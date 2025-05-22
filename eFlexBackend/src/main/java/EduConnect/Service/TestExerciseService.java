package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TestExerciseService {
    private static final Logger log = LoggerFactory.getLogger(TestExerciseService.class);
    private final TestExerciseRepository testExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public TestExerciseService(TestExerciseRepository testExerciseRepository, ExerciseRepository exerciseRepository,
                               UserRepository userRepository, LessonRepository lessonRepository) {
        this.testExerciseRepository = testExerciseRepository;
        this.exerciseRepository = exerciseRepository;
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
        log.info("Bắt đầu xử lý bài kiểm tra: testId={}, userId={}", testId, userId);
        log.debug("Danh sách câu trả lời: {}", answers);

        // Bước 1: Lấy thông tin bài kiểm tra
        log.info("Bước 1: Tìm bài kiểm tra với testId={}", testId);
        TestExercise test = testExerciseRepository.findById(testId)
                .orElseThrow(() -> {
                    log.error("Không tìm thấy bài kiểm tra với testId={}", testId);
                    return new RuntimeException("Không tìm thấy bài kiểm tra");
                });
        log.info("Tìm thấy bài kiểm tra: testId={}, lessonId={}", testId, test.getLesson().getId());
        // Bước 2: Lấy thông tin bài học hiện tại và môn học
        log.info("Bước 2: Lấy thông tin bài học hiện tại và môn học");
        Lesson currentLesson = test.getLesson();
        Long courseId = currentLesson.getCourse().getId();
        int latestLessonOrder = currentLesson.getViTri();
        log.info("Bài học hiện tại: lessonId={}, viTri={}, courseId={}", currentLesson.getId(), latestLessonOrder, courseId);

        // Bước 3: Lấy danh sách bài học trong môn học
        log.info("Bước 3: Lấy danh sách bài học trong môn học courseId={}", courseId);
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        lessons.sort((l1, l2) -> Integer.compare(l1.getViTri(), l2.getViTri()));
        log.info("Danh sách bài học: {}", lessons.stream().map(Lesson::getId).collect(Collectors.toList()));

        // Bước 4: Nhóm câu hỏi theo bài học (id_bai_hoc) và tính tỷ lệ đúng
        log.info("Bước 4: Nhóm câu hỏi theo bài học và tính tỷ lệ đúng");
        Map<Long, Double> lessonPerformance = new HashMap<>();
        Map<Long, List<AnswerRequest>> answersByLesson = answers.stream()
                .collect(Collectors.groupingBy(answer -> {
                    Exercise exercise = exerciseRepository.findById(answer.getIdExercise())
                            .orElseThrow(() -> {
                                log.error("Không tìm thấy câu hỏi với idExercise={}", answer.getIdExercise());
                                return new RuntimeException("Không tìm thấy câu hỏi");
                            });
                    return exercise.getId_BaiHoc();
                }));

        for (Map.Entry<Long, List<AnswerRequest>> entry : answersByLesson.entrySet()) {
            Long lessonId = entry.getKey();
            List<AnswerRequest> lessonAnswers = entry.getValue();
            log.info("Tính hiệu suất cho bài học lessonId={}", lessonId);

            long correctAnswers = lessonAnswers.stream()
                    .filter(answer -> {
                        Exercise exercise = exerciseRepository.findById(answer.getIdExercise())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi"));
                        boolean isCorrect = answer.getAnswer().equals(exercise.getDapAnDung().toString());
                        log.debug("Câu hỏi idExercise={}, đáp án chọn={}, đáp án đúng={}, đúng/sai={}",
                                answer.getIdExercise(), answer.getAnswer(), exercise.getDapAnDung(), isCorrect);
                        return isCorrect;
                    })
                    .count();

            double correctRate = (double) correctAnswers / lessonAnswers.size();
            lessonPerformance.put(lessonId, correctRate);
            log.info("Tỷ lệ đúng của bài học lessonId={}: {} / {} = {}", lessonId, correctAnswers, lessonAnswers.size(), correctRate);
        }
        log.info("Hiệu suất các bài học: {}", lessonPerformance);

        // Bước 5: Tìm bài học có hiệu suất thấp nhất
        log.info("Bước 5: Tìm bài học có hiệu suất thấp nhất");
        Long lessonToReviewId = null;
        double lowestCorrectRate = 1.0;
        for (Map.Entry<Long, Double> entry : lessonPerformance.entrySet()) {
            if (entry.getValue() < lowestCorrectRate) {
                lowestCorrectRate = entry.getValue();
                lessonToReviewId = entry.getKey();
            }
        }

        if (lowestCorrectRate < 0.8 && lessonToReviewId != null) {
            Lesson lessonToReview = null;
            for (Lesson lesson : lessons) {
                if (lesson.getId()==(lessonToReviewId)) {
                    lessonToReview = lesson;
                    break;
                }
            }
            if (lessonToReview != null) {
                log.info("Hiệu suất bài học thấp nhất (< 0.8), gợi ý ôn lại bài học: lessonId={}, correctRate={}",
                        lessonToReview.getId(), lowestCorrectRate);
                return createRecommendation(lessonToReview, "Ôn lại " + lessonToReview.getTenBai());
            }
        }

        // Bước 6: Gợi ý bài học tiếp theo nếu tất cả đều đạt
        log.info("Bước 6: Gợi ý bài học tiếp theo");
        Map<String, Object> recommendation = recommendNextLessonAfterCurrent(lessons, latestLessonOrder);
        log.info("Kết quả gợi ý: {}", recommendation);
        return recommendation;
    }

    private Map<String, Object> recommendNextLessonAfterCurrent(List<Lesson> lessons, int latestLessonOrder) {
        log.info("Tìm bài học tiếp theo sau viTri={}", latestLessonOrder);
        int nextLessonOrder = latestLessonOrder + 1;
        Lesson nextLesson = lessons.stream()
                .filter(lesson -> lesson.getViTri() == nextLessonOrder)
                .findFirst()
                .orElse(null);

        if (nextLesson != null) {
            log.info("Gợi ý học bài tiếp theo: lessonId={}, viTri={}", nextLesson.getId(), nextLessonOrder);
            return createRecommendation(nextLesson, "Tiếp tục học " + nextLesson.getTenBai());
        } else {
            log.info("Đã hoàn thành tất cả bài học, gợi ý ôn lại bài cuối: lessonId={}", lessons.get(lessons.size() - 1).getId());
            return createRecommendation(lessons.get(lessons.size() - 1), "Bạn đã hoàn thành tất cả bài học. Ôn lại " + lessons.get(lessons.size() - 1).getTenBai());
        }
    }

    private Map<String, Object> createRecommendation(Lesson lesson, String message) {
        log.info("Tạo gợi ý: lessonId={}, message={}", lesson.getId(), message);
        Map<String, Object> recommendation = new HashMap<>();
        recommendation.put("lesson_id", lesson.getId());
        recommendation.put("ten_bai_hoc", lesson.getTenBai());
        recommendation.put("vi_tri", lesson.getViTri());
        recommendation.put("message", message);
        return recommendation;
    }
    public TestExercise save(TestExercise testExercise) {
        return this.testExerciseRepository.save(testExercise);
    }
}
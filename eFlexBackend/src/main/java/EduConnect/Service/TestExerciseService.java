package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Repository.*;
import EduConnect.Util.Enum.Dificulty;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestExerciseService {
    private static final Logger log = LoggerFactory.getLogger(TestExerciseService.class);
    private final TestExerciseRepository testExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final HistoryTestExerciseRepository historyTestExerciseRepository;

    public TestExerciseService(TestExerciseRepository testExerciseRepository, ExerciseRepository exerciseRepository,
                               UserRepository userRepository, LessonRepository lessonRepository,
                               HistoryTestExerciseRepository historyTestExerciseRepository) {
        this.testExerciseRepository = testExerciseRepository;
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.historyTestExerciseRepository = historyTestExerciseRepository;
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
    public List<TestExercise>  getTestByLesson(Long lessonId,String nameCourse) {
        return this.testExerciseRepository.findByLessonIdExcepName(lessonId,"Level Assessment Test "+nameCourse);
    }
    public TestExercise getTestExerciseById(Long id) {
        return testExerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại: " + id));
    }
    public Map<String, Object> submitTestAndRecommend(Long userId, List<AnswerRequest> answers) {
        log.info("Bước 1: Bắt đầu xử lý bài kiểm tra cho userId={} với {} câu trả lời", userId, answers.size());

        if (answers.isEmpty()) {
            log.warn("Danh sách câu trả lời rỗng");
            throw new IllegalArgumentException("Danh sách câu trả lời không được rỗng");
        }

        // Lấy User
        User user = userRepository.findById(userId);

        // Lấy TestExercise từ câu hỏi đầu tiên
        Exercise firstExercise = exerciseRepository.findById(answers.get(0).getIdExercise())
                .orElseThrow(() -> {
                    log.error("Không tìm thấy câu hỏi với idExercise={}", answers.get(0).getIdExercise());
                    return new RuntimeException("Không tìm thấy câu hỏi");
                });
        TestExercise test = firstExercise.getTestExercise();
        if (test == null) {
            log.error("Không tìm thấy TestExercise cho câu hỏi idExercise={}", firstExercise.getId());
            throw new RuntimeException("Không tìm thấy bài kiểm tra");
        }

        log.info("Bước 2: Lấy thông tin bài học hiện tại và môn học");
        Lesson currentLesson = test.getLesson();
        if (currentLesson == null) {
            log.error("Không tìm thấy Lesson cho TestExercise id={}", test.getId());
            throw new RuntimeException("Không tìm thấy bài học");
        }
        Long courseId = currentLesson.getCourse().getId();
        int latestLessonOrder = currentLesson.getViTri();
        log.info("Bài học hiện tại: lessonId={}, viTri={}, courseId={}", currentLesson.getId(), latestLessonOrder, courseId);

        log.info("Bước 3: Lấy danh sách bài học trong môn học courseId={}", courseId);
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        lessons.sort(Comparator.comparingInt(Lesson::getViTri));
        log.info("Danh sách bài học: {}", lessons.stream().map(Lesson::getId).collect(Collectors.toList()));

        log.info("Bước 4: Nhóm câu hỏi theo bài học và tính hiệu suất có cân nhắc độ khó");
        Map<Long, LessonPerformance> lessonPerformance = new HashMap<>();
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

            double totalWeightedScore = 0.0;
            double totalWeight = 0.0;
            int correctAnswers = 0;

            for (AnswerRequest answer : lessonAnswers) {
                Exercise exercise = exerciseRepository.findById(answer.getIdExercise())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi"));

                double weight = getDifficultyWeight(exercise.getDificulty());
                totalWeight += weight;

                boolean isCorrect = answer.getAnswer().equals(exercise.getDapAnDung().toString());
                if (isCorrect) {
                    correctAnswers++;
                    totalWeightedScore += weight;
                }

                log.debug("Câu hỏi idExercise={}, độ khó={}, đáp án chọn={}, đáp án đúng={}, đúng/sai={}",
                        answer.getIdExercise(), exercise.getDificulty(), answer.getAnswer(), exercise.getDapAnDung(), isCorrect);
            }

            double weightedCorrectRate = totalWeight > 0 ? totalWeightedScore / totalWeight : 0.0;
            lessonPerformance.put(lessonId, new LessonPerformance(weightedCorrectRate, correctAnswers, lessonAnswers.size()));
            log.info("Hiệu suất bài học lessonId={}: đúng={} / {}, tỷ lệ có trọng số={}",
                    lessonId, correctAnswers, lessonAnswers.size(), weightedCorrectRate);
        }

        log.info("Bước 5: Lấy lịch sử làm bài kiểm tra");
        List<HistoryTestExercise> historyList = historyTestExerciseRepository.findByUserIdAndTestExerciseLessonCourseId(userId, courseId);
        double averageHistoricalRate = historyList.stream()
                .mapToDouble(HistoryTestExercise::getWeightedCorrectRate)
                .average()
                .orElse(0.0);
        log.info("Điểm trung bình lịch sử của userId={} trong courseId={}: {}", userId, courseId, averageHistoricalRate);

        log.info("Bước 6: Gợi ý bài học dựa trên hiệu suất hiện tại và lịch sử");
        Lesson lessonToReview = null;
        double lowestWeightedCorrectRate = 1.0;

        for (Map.Entry<Long, LessonPerformance> entry : lessonPerformance.entrySet()) {
            Long lessonId = entry.getKey();
            double correctRate = entry.getValue().getWeightedCorrectRate();
            if (correctRate < lowestWeightedCorrectRate) {
                lowestWeightedCorrectRate = correctRate;
                lessonToReview = lessons.stream()
                        .filter(lesson -> lesson.getId() == lessonId)
                        .findFirst()
                        .orElse(null);
            }
        }

        // Logic gợi ý
        if (historyList.isEmpty()) {
            // Người dùng mới
            if (lowestWeightedCorrectRate >= 0.8) {
                log.info("Người dùng mới đạt điểm cao (weightedCorrectRate={}), gợi ý ôn lại bài hiện tại để xác nhận", lowestWeightedCorrectRate);
                return createRecommendation(currentLesson, "Bạn làm bài rất tốt! Ôn lại bài " + currentLesson.getTenBai() + " để củng cố kiến thức trước khi tiếp tục");
            } else {
                log.info("Người dùng mới có hiệu suất thấp (weightedCorrectRate={}), gợi ý ôn lại bài hiện tại", lowestWeightedCorrectRate);
                return createRecommendation(currentLesson, "Ôn lại bài " + currentLesson.getTenBai() + " để cải thiện hiệu suất");
            }
        } else if (lowestWeightedCorrectRate < 0.8 && lessonToReview != null) {
            // Hiệu suất thấp, ôn lại bài yếu
            log.info("Hiệu suất thấp nhất (< 0.8), gợi ý ôn lại bài học: lessonId={}, weightedCorrectRate={}",
                    lessonToReview.getId(), lowestWeightedCorrectRate);
            return createRecommendation(lessonToReview, "Ôn lại bài " + lessonToReview.getTenBai() + " do hiệu suất thấp");
        } else if (averageHistoricalRate < 0.7) {
            // Lịch sử kém, ôn lại bài yếu nhất trong lịch sử
            Long weakestLessonId = historyList.stream()
                    .collect(Collectors.groupingBy(h -> h.getTestExercise().getLesson().getId(),
                            Collectors.averagingDouble(HistoryTestExercise::getWeightedCorrectRate)))
                    .entrySet().stream()
                    .min(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(currentLesson.getId());
            lessonToReview = lessons.stream()
                    .filter(lesson -> lesson.getId() == weakestLessonId)
                    .findFirst()
                    .orElse(currentLesson);
            log.info("Lịch sử kém (averageHistoricalRate={}), gợi ý ôn lại bài yếu nhất: lessonId={}",
                    averageHistoricalRate, lessonToReview.getId());
            return createRecommendation(lessonToReview, "Ôn lại bài " + lessonToReview.getTenBai() + " do hiệu suất lịch sử thấp");
        }

        // Gợi ý bài học tiếp theo
        log.info("Bước 7: Gợi ý bài học tiếp theo");
        Map<String, Object> recommendation = recommendNextLessonAfterCurrent(lessons, latestLessonOrder);
        log.info("Kết quả gợi ý: {}", recommendation);

        // Lưu kết quả bài kiểm tra vào HistoryTestExercise sau khi gợi ý
        double currentWeightedCorrectRate = lessonPerformance.values().stream()
                .mapToDouble(LessonPerformance::getWeightedCorrectRate)
                .average()
                .orElse(0.0);
        HistoryTestExercise history = new HistoryTestExercise();
        history.setUser(user);
        history.setTestExercise(test);
        history.setWeightedCorrectRate(currentWeightedCorrectRate);
        historyTestExerciseRepository.save(history);
        log.info("Lưu lịch sử bài kiểm tra: userId={}, testExerciseId={}, weightedCorrectRate={}",
                userId, test.getId(), currentWeightedCorrectRate);

        return recommendation;
    }

    private double getDifficultyWeight(Dificulty dificulty) {
        if (dificulty == null) {
            return 1.0;
        }
        switch (dificulty) {
            case EASY:
                return 1.0;
            case MEDIUM:
                return 2.0;
            case HARD:
                return 3.0;
            default:
                return 1.0;
        }
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
            return createRecommendation(nextLesson, "Tiếp tục học bài " + nextLesson.getTenBai());
        } else {
            log.info("Đã hoàn thành tất cả bài học, gợi ý ôn lại bài cuối: lessonId={}", lessons.get(lessons.size() - 1).getId());
            return createRecommendation(lessons.get(lessons.size() - 1), "Bạn đã hoàn thành tất cả bài học. Ôn lại bài " + lessons.get(lessons.size() - 1).getTenBai());
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
    @Getter
    @Setter
    private static class LessonPerformance {
        private final double weightedCorrectRate;
        private final int correctAnswers;
        private final int totalAnswers;

        public LessonPerformance(double weightedCorrectRate, int correctAnswers, int totalAnswers) {
            this.weightedCorrectRate = weightedCorrectRate;
            this.correctAnswers = correctAnswers;
            this.totalAnswers = totalAnswers;
        }
    }


    public TestExercise save(TestExercise testExercise) {
        return this.testExerciseRepository.save(testExercise);
    }
    public TestExercise findByName(String name){
        return this.testExerciseRepository.findByName(name);
    }
}
package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Repository.*;
import EduConnect.Util.Enum.Dificulty;
import EduConnect.Util.Enum.QuestionType;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

        // Tối ưu: Lấy tất cả Exercise trong một lần query
        List<Long> exerciseIds = answers.stream().map(AnswerRequest::getIdExercise).collect(Collectors.toList());
        Map<Long, Exercise> exerciseMap = exerciseRepository.findAllById(exerciseIds)
                .stream().collect(Collectors.toMap(Exercise::getId, e -> e));
        if (exerciseMap.size() != exerciseIds.size()) {
            log.error("Không tìm thấy một số câu hỏi: requested={}, found={}", exerciseIds.size(), exerciseMap.size());
            throw new RuntimeException("Không tìm thấy một số câu hỏi");
        }

        // Lấy TestExercise
        Exercise firstExercise = exerciseMap.get(answers.get(0).getIdExercise());
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

        log.info("Bước 3: Lấy danh sách bài học");
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        lessons.sort(Comparator.comparingInt(Lesson::getViTri));

        log.info("Bước 4: Tính hiệu suất theo questionType và bài học");
        Map<QuestionType, TypePerformance> typePerformance = new HashMap<>();
        Map<Long, LessonPerformance> lessonPerformance = new HashMap<>();
        double totalTimeTaken = 0.0;

        Map<Long, List<AnswerRequest>> answersByLesson = answers.stream()
                .collect(Collectors.groupingBy(answer -> exerciseMap.get(answer.getIdExercise()).getId_BaiHoc()));

        for (Map.Entry<Long, List<AnswerRequest>> entry : answersByLesson.entrySet()) {
            Long lessonId = entry.getKey();
            List<AnswerRequest> lessonAnswers = entry.getValue();

            double totalWeightedScore = 0.0;
            double totalWeight = 0.0;
            int correctAnswers = 0;

            for (AnswerRequest answer : lessonAnswers) {
                Exercise exercise = exerciseMap.get(answer.getIdExercise());
                QuestionType questionType = exercise.getQuestionType() != null ? exercise.getQuestionType() : QuestionType.MultipleChoice;
                double weight = getDifficultyWeight(exercise.getDificulty());
                totalWeight += weight;
                totalTimeTaken += answer.getTimeTaken();

                boolean isCorrect = answer.getAnswer().equals(exercise.getDapAnDung().toString());
                if (isCorrect) {
                    correctAnswers++;
                    totalWeightedScore += weight;
                }

                // Cập nhật hiệu suất theo questionType
                TypePerformance typePerf = typePerformance.computeIfAbsent(questionType, k -> new TypePerformance());
                typePerf.addAnswer(isCorrect, weight);

                log.debug("Câu hỏi idExercise={}, questionType={}, độ khó={}, đúng/sai={}",
                        answer.getIdExercise(), questionType, exercise.getDificulty(), isCorrect);
            }

            double weightedCorrectRate = totalWeight > 0 ? totalWeightedScore / totalWeight : 0.0;
            lessonPerformance.put(lessonId, new LessonPerformance(weightedCorrectRate, correctAnswers, lessonAnswers.size()));
            log.info("Hiệu suất bài học lessonId={}: đúng={} / {}, tỷ lệ={}",
                    lessonId, correctAnswers, lessonAnswers.size(), weightedCorrectRate);
        }

        double averageTimePerQuestion = answers.size() > 0 ? totalTimeTaken / answers.size() : 0.0;
        log.info("Thời gian trung bình mỗi câu: {} giây", averageTimePerQuestion);

        // Lưu kết quả bài kiểm tra
        double currentWeightedCorrectRate = lessonPerformance.values().stream()
                .mapToDouble(LessonPerformance::getWeightedCorrectRate)
                .average()
                .orElse(0.0);
        HistoryTestExercise history = new HistoryTestExercise();
        history.setUser(user);
        history.setTestExercise(test);
        history.setWeightedCorrectRate(currentWeightedCorrectRate);
        history.setTimeWeight(getTimeWeight(Instant.now()));
        historyTestExerciseRepository.save(history);
        log.info("Lưu lịch sử: userId={}, testExerciseId={}, weightedCorrectRate={}",
                userId, test.getId(), currentWeightedCorrectRate);

        log.info("Bước 5: Lấy lịch sử làm bài kiểm tra");
        List<HistoryTestExercise> historyList = historyTestExerciseRepository.findByUserIdAndTestExerciseLessonCourseId(userId, courseId);
        double averageHistoricalRate = historyList.stream()
                .mapToDouble(h -> h.getWeightedCorrectRate() * getTimeWeight(h.getNgayTao()))
                .sum() / historyList.stream().mapToDouble(h -> getTimeWeight(h.getNgayTao())).sum();
        if (historyList.isEmpty()) {
            averageHistoricalRate = 0.0;
        }
        log.info("Điểm trung bình lịch sử: {}", averageHistoricalRate);

        log.info("Bước 6: Gợi ý bài học");
        double dynamicThreshold = 0.7 + (answers.size() < 10 ? 0.1 : 0.0);

        // Tìm questionType yếu nhất
        QuestionType weakestType = null;
        double lowestTypeRate = 1.0;
        for (Map.Entry<QuestionType, TypePerformance> entry : typePerformance.entrySet()) {
            double typeRate = entry.getValue().getWeightedCorrectRate();
            if (typeRate < lowestTypeRate) {
                lowestTypeRate = typeRate;
                weakestType = entry.getKey();
            }
        }

        // Logic gợi ý
        double lowestLessonRate = lessonPerformance.values().stream()
                .mapToDouble(LessonPerformance::getWeightedCorrectRate)
                .min().orElse(1.0);

        if (historyList.size() == 1) { // Chỉ có bản ghi vừa lưu, coi là người dùng mới
            if (lowestLessonRate >= dynamicThreshold) {
                if (averageTimePerQuestion < 5.0) {
                    log.info("Người dùng mới làm nhanh, gợi ý bài kiểm tra bổ sung");
                    return createRecommendation(currentLesson, "Bạn làm bài nhanh và đúng! Hãy làm thêm bài kiểm tra để xác nhận");
                } else {
                    log.info("Người dùng mới đạt điểm cao, gợi ý ôn lại bài hiện tại");
                    return createRecommendation(currentLesson, "Bạn làm bài rất tốt! Ôn lại bài " + currentLesson.getTenBai() + " để củng cố");
                }
            } else {
                Lesson reviewLesson = findLessonByQuestionType(lessons, weakestType, currentLesson);
                log.info("Người dùng mới có hiệu suất thấp, gợi ý ôn lại bài liên quan đến {}", weakestType);
                return createRecommendation(reviewLesson, "Ôn lại bài " + reviewLesson.getTenBai() + " Hệ thống đánh giá kĩ năng " + weakestType +" bạn cần cải thiện. ");
            }
        } else if (lowestTypeRate < dynamicThreshold && weakestType != null) {
            Lesson reviewLesson = findLessonByQuestionType(lessons, weakestType, currentLesson);
            log.info("Hiệu suất thấp nhất cho {} (rate={}), gợi ý ôn lại bài liên quan", weakestType, lowestTypeRate);
            return createRecommendation(reviewLesson, "Ôn lại bài " + reviewLesson.getTenBai() + " Hệ thống đánh giá kĩ năng " + weakestType +" bạn cần cải thiện. ");
        } else if (averageHistoricalRate < 0.65) {
            Long weakestLessonId = historyList.stream()
                    .collect(Collectors.groupingBy(h -> h.getTestExercise().getLesson().getId(),
                            Collectors.averagingDouble(HistoryTestExercise::getWeightedCorrectRate)))
                    .entrySet().stream()
                    .min(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(currentLesson.getId());
            Lesson reviewLesson = lessons.stream()
                    .filter(lesson -> lesson.getId() == weakestLessonId)
                    .findFirst()
                    .orElse(currentLesson);
            return createRecommendation(reviewLesson, "Ôn lại bài " + reviewLesson.getTenBai() + " do hiệu suất lịch sử thấp");
        }

        return recommendNextLessonAfterCurrent(lessons, latestLessonOrder);
    }
    private Lesson findLessonByQuestionType(List<Lesson> lessons, QuestionType questionType, Lesson defaultLesson) {
        return lessons.stream()
                .filter(lesson -> lesson.getQuestionTypes() != null && lesson.getQuestionTypes().contains(questionType))
                .min(Comparator.comparingInt(Lesson::getViTri))
                .orElse(defaultLesson);
    }

    private double getDifficultyWeight(Dificulty dificulty) {
        if (dificulty == null) return 1.0;
        switch (dificulty) {
            case EASY: return 1.0;
            case MEDIUM: return 2.0;
            case HARD: return 3.0;
            default: return 1.0;
        }
    }

    private double getTimeWeight(Instant ngayTao) {
        long daysAgo = ChronoUnit.DAYS.between(ngayTao, Instant.now());
        return Math.max(0.1, 1.0 - daysAgo * 0.05);
    }

    private Map<String, Object> recommendNextLessonAfterCurrent(List<Lesson> lessons, int latestLessonOrder) {
        int nextLessonOrder = latestLessonOrder + 1;
        Lesson nextLesson = lessons.stream()
                .filter(lesson -> lesson.getViTri() == nextLessonOrder)
                .findFirst()
                .orElse(null);

        if (nextLesson != null) {
            return createRecommendation(nextLesson, "Tiếp tục học bài " + nextLesson.getTenBai());
        } else {
            return createRecommendation(lessons.get(lessons.size() - 1), "Bạn đã hoàn thành tất cả bài học. Ôn lại bài " + lessons.get(lessons.size() - 1).getTenBai());
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

        public double getWeightedCorrectRate() {
            return weightedCorrectRate;
        }
    }
    @Getter
    @Setter
    private static class TypePerformance {
        private double totalWeightedScore = 0.0;
        private double totalWeight = 0.0;
        private int correctAnswers = 0;
        private int totalAnswers = 0;

        public void addAnswer(boolean isCorrect, double weight) {
            totalWeight += weight;
            totalAnswers++;
            if (isCorrect) {
                correctAnswers++;
                totalWeightedScore += weight;
            }
        }

        public double getWeightedCorrectRate() {
            return totalWeight > 0 ? totalWeightedScore / totalWeight : 0.0;
        }
    }


    public TestExercise save(TestExercise testExercise) {
        return this.testExerciseRepository.save(testExercise);
    }
    public TestExercise findByName(String name){
        return this.testExerciseRepository.findByName(name);
    }
}
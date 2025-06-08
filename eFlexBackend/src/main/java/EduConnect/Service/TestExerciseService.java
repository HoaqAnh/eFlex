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
    @Transactional
    public Map<String, Object> submitTestAndRecommend(Long userId, List<AnswerRequest> answers) {
        log.info("Bước 1: Bắt đầu xử lý bài kiểm tra cho userId={} với {} câu trả lời", userId, answers.size());
        if (answers == null || answers.isEmpty()) {
            log.warn("Danh sách câu trả lời rỗng");
            throw new IllegalArgumentException("Danh sách câu trả lời không được rỗng");
        }

        User user = userRepository.findById(userId);
        List<Long> exerciseIds = answers.stream().map(AnswerRequest::getIdExercise).collect(Collectors.toList());
        Map<Long, Exercise> exerciseMap = exerciseRepository.findAllById(exerciseIds)
                .stream().collect(Collectors.toMap(Exercise::getId, e -> e));
        if (exerciseMap.size() != exerciseIds.size()) {
            log.error("Không tìm thấy một số câu hỏi: requested={}, found={}", exerciseIds.size(), exerciseMap.size());
            throw new RuntimeException("Không tìm thấy một số câu hỏi");
        }

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

                boolean isCorrect = answer.getAnswer().equals(exercise.getDapAnDung().toString());
                if (isCorrect) {
                    correctAnswers++;
                    totalWeightedScore += weight;
                }

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

        double currentWeightedCorrectRate = lessonPerformance.values().stream()
                .mapToDouble(LessonPerformance::getWeightedCorrectRate)
                .average()
                .orElse(0.0);
        HistoryTestExercise history = new HistoryTestExercise();
        history.setUser(user);
        history.setTestExercise(test);
        history.setWeightedCorrectRate(currentWeightedCorrectRate);
        history.setTimeWeight(1.0); // bỏ thời gian thực tế, dùng mặc định 1.0 hoặc xoá luôn nếu không cần
        historyTestExerciseRepository.save(history);
        log.info("Lưu lịch sử: userId={}, testExerciseId={}, weightedCorrectRate={}",
                userId, test.getId(), currentWeightedCorrectRate);

        log.info("Bước 5: Lấy lịch sử làm bài kiểm tra cho bài kiểm tra hiện tại");
        List<HistoryTestExercise> historyList = historyTestExerciseRepository.findByUserIdAndTestExercise_Id(userId, test.getId());
        log.info("Lấy ra lịch sử 5 bài gần đây nhất cho bài kiểm tra testId={}", test.getId());
        List<HistoryTestExercise> recent5Tests = historyList.stream()
                .sorted(Comparator.comparing(HistoryTestExercise::getNgayTao).reversed())
                .limit(5)
                .collect(Collectors.toList());

        double averageHistoricalRate = recent5Tests.stream()
                .mapToDouble(HistoryTestExercise::getWeightedCorrectRate)
                .average()
                .orElse(0.0);
        if (historyList.isEmpty()) {
            averageHistoricalRate = 0.0;
        }
        log.info("Điểm trung bình lịch sử cho bài kiểm tra testId={}: {}", test.getId(), averageHistoricalRate);

        log.info("Bước 6: Gợi ý dựa trên hiệu suất bài học");
        double dynamicThreshold = 0.7 + (answers.size() < 10 ? 0.1 : 0.0);

        Long weakestLessonId = null;
        double lowestLessonRate = 1.0;
        for (Map.Entry<Long, LessonPerformance> entry : lessonPerformance.entrySet()) {
            Long lessonId = entry.getKey();
            double rate = entry.getValue().getWeightedCorrectRate();
            if (rate < lowestLessonRate) {
                lowestLessonRate = rate;
                weakestLessonId = lessonId;
            }
        }

        double combinedRate = historyList.isEmpty() ? lowestLessonRate : (0.7 * lowestLessonRate + 0.3 * averageHistoricalRate);

        if (weakestLessonId != null && combinedRate < dynamicThreshold) {
            final Long finalWeakestLessonId = weakestLessonId;
            Lesson weakestLesson = lessons.stream()
                    .filter(lesson -> lesson.getId() == finalWeakestLessonId)
                    .findFirst()
                    .orElse(null);
            if (weakestLesson != null) {
                log.info("Hiệu suất thấp nhất cho bài học lessonId={} (combinedRate={}), gợi ý ôn tập", finalWeakestLessonId, combinedRate);
                return createRecommendation("Hãy ôn tập bài học '" + weakestLesson.getTenBai() + "' để cải thiện hiệu suất", weakestLesson.getId());
            }
        }

        log.info("Bước 7: Gợi ý bài học tiếp theo");
        final int finalLatestLessonOrder = latestLessonOrder;
        Lesson nextLesson = lessons.stream()
                .filter(lesson -> lesson.getViTri() == finalLatestLessonOrder + 1)
                .findFirst()
                .orElse(null);
        if (nextLesson != null) {
            return createRecommendation("Hãy tiếp tục học bài học '" + nextLesson.getTenBai() + "' trong khóa học", nextLesson.getId());
        }

        return createRecommendation("Bạn đã hoàn thành tất cả bài học trong khóa học này!", null);
    }

    @Transactional
    public Map<String, Object> submitAssessmentTest(Long userId, List<AnswerRequest> answers) {
        log.info("Bắt đầu xử lý bài đánh giá năng lực đầu vào cho userId={} với {} câu trả lời", userId, answers.size());

        if (answers == null || answers.isEmpty()) {
            throw new IllegalArgumentException("Danh sách câu trả lời không được rỗng");
        }

        User user = userRepository.findById(userId);
        if (user == null) throw new RuntimeException("Không tìm thấy người dùng");

        // Lấy tất cả bài tập từ danh sách id
        List<Long> exerciseIds = answers.stream()
                .map(AnswerRequest::getIdExercise)
                .collect(Collectors.toList());

        Map<Long, Exercise> exerciseMap = exerciseRepository.findAllById(exerciseIds).stream()
                .collect(Collectors.toMap(Exercise::getId, e -> e));

        if (exerciseMap.size() != exerciseIds.size()) {
            throw new RuntimeException("Một số câu hỏi không tồn tại trong hệ thống");
        }

        // Gom câu trả lời theo bài học
        Map<Long, List<AnswerRequest>> answersByLesson = answers.stream()
                .collect(Collectors.groupingBy(
                        a -> exerciseMap.get(a.getIdExercise()).getId_BaiHoc()
                ));

        Map<Long, LessonPerformance> lessonPerformanceMap = new HashMap<>();

        for (Map.Entry<Long, List<AnswerRequest>> entry : answersByLesson.entrySet()) {
            Long lessonId = entry.getKey();
            List<AnswerRequest> lessonAnswers = entry.getValue();

            int correctCount = 0;
            double totalWeight = 0;
            double correctWeight = 0;

            for (AnswerRequest answer : lessonAnswers) {
                Exercise exercise = exerciseMap.get(answer.getIdExercise());
                boolean isCorrect = answer.getAnswer().equals(exercise.getDapAnDung().toString());
                double weight = getDifficultyWeight(exercise.getDificulty());

                totalWeight += weight;
                if (isCorrect) correctWeight += weight;

                if (isCorrect) correctCount++;
            }

            double rate = totalWeight > 0 ? correctWeight / totalWeight : 0.0;
            lessonPerformanceMap.put(lessonId, new LessonPerformance(rate, correctCount, lessonAnswers.size()));
            log.info("LessonId={} - Correct {}/{} - WeightedCorrectRate={}", lessonId, correctCount, lessonAnswers.size(), rate);
        }

        // Tìm bài học yếu nhất
        Long weakestLessonId = null;
        double lowestRate = 1.0;

        for (Map.Entry<Long, LessonPerformance> entry : lessonPerformanceMap.entrySet()) {
            if (entry.getValue().getWeightedCorrectRate() < lowestRate) {
                lowestRate = entry.getValue().getWeightedCorrectRate();
                weakestLessonId = entry.getKey();
            }
        }

        // Gợi ý bài học yếu nhất
        if (weakestLessonId != null && lowestRate < 0.7) {
            Lesson weakestLesson = lessonRepository.findById(weakestLessonId).orElse(null);
            if (weakestLesson != null) {
                return createRecommendation("Bạn nên ôn lại bài học '" + weakestLesson.getTenBai() + "' để cải thiện năng lực.", weakestLesson.getId());
            }
        }


        return createRecommendation("Hệ thống đánh giá kiến thức của bạn hiện tại đã nắm chắc ở môn học này.", null);
    }


    private double getDifficultyWeight(Dificulty dificulty) {
        if (dificulty == null) return 1.0;
        switch (dificulty) {
            case EASY: return 1.0;
            case MEDIUM: return 1.5;
            case HARD: return 3.0;
            default: return 1.0;
        }
    }

    private double getTimeWeight(Instant ngayTao) {
        long daysAgo = ChronoUnit.DAYS.between(ngayTao, Instant.now());
        return Math.max(0.1, 1.0 - daysAgo * 0.05);
    }

    private Map<String, Object> createRecommendation(String message, Long lessonId) {
        Map<String, Object> recommendation = new HashMap<>();
        recommendation.put("message", message);
        if (lessonId != null) {
            recommendation.put("lessonId", lessonId);
        }
        return recommendation;
    }

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
package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Response.CountCourseDTO;
import EduConnect.Domain.Response.LessonDTO;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Repository.CourseRepository;
import EduConnect.Repository.KetQuaBaiKiemTraRepository;
import EduConnect.Repository.LessonRepository;
import EduConnect.Repository.TestExerciseRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LessonService {
    private final CourseRepository courseRepository;
    private final TestExerciseRepository testExerciseRepository;
    private LessonRepository lessonRepository;
    private ExerciseService exerciseService;
    private final KetQuaBaiKiemTraRepository ketQuaBaiKiemTraRepository;

    public LessonService(LessonRepository lessonRepository,
                         CourseRepository courseRepository,
                         ExerciseService exerciseService,
                         TestExerciseRepository testExerciseRepository,
                         KetQuaBaiKiemTraRepository ketQuaBaiKiemTraRepository) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
    this.exerciseService = exerciseService;
    this.ketQuaBaiKiemTraRepository = ketQuaBaiKiemTraRepository;
    this.testExerciseRepository = testExerciseRepository;
}

    public Lesson createLesson(Lesson lesson) {
        Integer maxViTri = lessonRepository.findMaxViTriByCourseId(lesson.getCourse().getId());
        int nextViTri = (maxViTri == null) ? 0 : maxViTri + 1;

        lesson.setViTri(nextViTri);
        return lessonRepository.save(lesson);
    }


    public CountCourseDTO CountLessonByCourse(long id)
    {
        CountCourseDTO countCourseDTO = new CountCourseDTO();
        countCourseDTO.setBaiHoc(this.lessonRepository.countLessonByCourseId(id));
        countCourseDTO.setBaiTap(this.exerciseService.countExerciseByCourse(id));
        return countCourseDTO;
    }
    public List<Lesson> importLessons(MultipartFile file, long idCourse) {
        List<Lesson> lessons = new ArrayList<>();
        try {
            System.out.println("File type: " + file.getContentType());
            if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                throw new IllegalArgumentException("File không phải định dạng Excel (.xlsx)");
            }

            InputStream is = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(is);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                Lesson lesson = new Lesson();
                lesson.setTenBai(row.getCell(0).getStringCellValue());
                lesson.setViTri((int) row.getCell(1).getNumericCellValue());

                Optional<Course> course = courseRepository.findById(idCourse);
                course.ifPresent(lesson::setCourse);

                lessons.add(lesson);
            }
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lessonRepository.saveAll(lessons);
    }
    public ResultPaginationDTO getAll(Pageable pageable) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        Page<Lesson> listLess=this.lessonRepository.findAll(pageable);

        ResultPaginationDTO.Meta meta=new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber()+1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(listLess.getTotalPages());
        meta.setTotal(listLess.getTotalElements());

        result.setMeta(meta);

        result.setResult(listLess);
        return result;
    }
    public List<LessonDTO> getLessonByCourse(long idCourse) {
        List<Lesson> lessons = this.lessonRepository.findByLessByCourseId(idCourse);

        return lessons.stream()
                .map(lesson -> new LessonDTO(lesson.getId(), lesson.getTenBai(), lesson.getNgayTao(), lesson.getViTri()))
                .toList();
    }
    // Gợi ý bài học tiếp theo cho người dùng dựa trên hiệu suất bài kiểm tra
    public Map<String, Object> recommendNextLesson(Long userId, Long courseId) {
        // Bước 1: Lấy tất cả bài học của môn học
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        if (lessons.isEmpty()) {
            throw new RuntimeException("Không tìm thấy bài học cho môn học này");
        }

        // Sắp xếp bài học theo vị trí (viTri)
        lessons.sort((l1, l2) -> Integer.compare(l1.getViTri(), l2.getViTri()));

        // Bước 2: Lấy lịch sử làm bài kiểm tra của người dùng trong môn học
        List<KetQuaBaiKiemTra> userResults = ketQuaBaiKiemTraRepository.findByUserIdAndCourseId(userId, courseId);
        if (userResults.isEmpty()) {
            // Nếu người dùng chưa làm bài kiểm tra nào, gợi ý Bài 1
            return createRecommendation(lessons.get(0), "Học " + lessons.get(0).getTenBai());
        }

        // Bước 3: Xác định bài học hiện tại (bài học cuối cùng người dùng đã làm)
        int latestLessonOrder = userResults.stream()
                .map(result -> {
                    TestExercise test = testExerciseRepository.findById(result.getTestExercise().getId()).orElse(null);
                    return test != null ? test.getLesson() : null;
                })
                .filter(lesson -> lesson != null)
                .mapToInt(Lesson::getViTri)
                .max()
                .orElse(1);

        Lesson currentLesson = lessons.stream()
                .filter(lesson -> lesson.getViTri() == latestLessonOrder)
                .findFirst()
                .orElse(lessons.get(0));

        // Tìm bài kiểm tra của bài học hiện tại
        List<TestExercise> currentTests = testExerciseRepository.findByLessonId(currentLesson.getId());
        if (currentTests.isEmpty()) {
            // Nếu bài học hiện tại không có bài kiểm tra, gợi ý học bài tiếp theo
            return recommendNextLessonAfterCurrent(lessons, latestLessonOrder);
        }

        // Lấy bài kiểm tra cuối cùng trong bài học hiện tại
        TestExercise currentTest = currentTests.get(currentTests.size() - 1);

        // Bước 4: Đánh giá hiệu suất trong bài kiểm tra hiện tại
        List<KetQuaBaiKiemTra> currentTestResults = userResults.stream()
                .filter(result -> result.getTestExercise().getId()==(currentTest.getId()))
                .collect(Collectors.toList());

        double currentLessonCorrectRate = calculateCorrectRate(currentTestResults);
        if (currentLessonCorrectRate < 0.8) {
            // Hiệu suất kém, gợi ý ôn lại bài hiện tại
            return createRecommendation(currentLesson, "Ôn lại " + currentLesson.getTenBai());
        }

        // Bước 5: Đánh giá hiệu suất các bài học trước trong bài kiểm tra hiện tại
        Map<Long, Double> previousLessonsPerformance = new HashMap<>();
        for (int order = 1; order < latestLessonOrder; order++) {
            int lessonOrder = order;
            Lesson previousLesson = lessons.stream()
                    .filter(lesson -> lesson.getViTri() == lessonOrder)
                    .findFirst()
                    .orElse(null);

            if (previousLesson != null) {
                List<KetQuaBaiKiemTra> previousLessonResults = currentTestResults.stream()
                        .filter(result -> {
                            Exercise exercise = exerciseService.findById(result.getExerciseType().getId());
                            return exercise != null && exercise.getId_BaiHoc() == previousLesson.getId();
                        })
                        .collect(Collectors.toList());

                double correctRate = calculateCorrectRate(previousLessonResults);
                previousLessonsPerformance.put(previousLesson.getId(), correctRate);
            }
        }

        // Tìm bài học trước có hiệu suất thấp nhất
        for (Map.Entry<Long, Double> entry : previousLessonsPerformance.entrySet()) {
            if (entry.getValue() < 0.8) {
                Lesson lessonToReview = lessonRepository.findById(entry.getKey()).orElse(null);
                if (lessonToReview != null) {
                    return createRecommendation(lessonToReview, "Ôn lại " + lessonToReview.getTenBai());
                }
            }
        }

        // Bước 6: Gợi ý bài học tiếp theo nếu hiệu suất tốt
        return recommendNextLessonAfterCurrent(lessons, latestLessonOrder);
    }

    private double calculateCorrectRate(List<KetQuaBaiKiemTra> results) {
        if (results.isEmpty()) return 1.0;
        long correctAnswers = results.stream().filter(KetQuaBaiKiemTra::getDungSai).count();
        return (double) correctAnswers / results.size();
    }

    private Map<String, Object> recommendNextLessonAfterCurrent(List<Lesson> lessons, int latestLessonOrder) {
        int nextLessonOrder = latestLessonOrder + 1;
        Lesson nextLesson = lessons.stream()
                .filter(lesson -> lesson.getViTri() == nextLessonOrder)
                .findFirst()
                .orElse(null);

        if (nextLesson != null) {
            return createRecommendation(nextLesson, "Học " + nextLesson.getTenBai());
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

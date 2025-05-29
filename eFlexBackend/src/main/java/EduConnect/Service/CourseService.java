package EduConnect.Service;


import EduConnect.Domain.Course;
import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.Course_LessonResponse;
import EduConnect.Domain.Response.ExerciseResponseDTO;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Domain.TestExercise;
import EduConnect.Repository.CourseRepository;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.ProgressLessonRepository;
import EduConnect.Repository.TienDoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TienDoRepository tienDoRepository;
    private final ExerciseService exerciseService;
    private final ProgressLessonRepository progressLessonRepository;
    private final TestExerciseService testExerciseService;

    public CourseService(CourseRepository courseRepository, TienDoRepository tienDoRepository,
                         ExerciseService exerciseService,
                         ProgressLessonRepository progressLessonRepository, TestExerciseService testExerciseService) {
        this.courseRepository = courseRepository;
        this.tienDoRepository = tienDoRepository;
        this.exerciseService = exerciseService;
        this.progressLessonRepository = progressLessonRepository;
        this.testExerciseService = testExerciseService;
    }
    public Course findByTenMon(String tenMon) {
        return courseRepository.findByTenMon(tenMon);
    }
    public Course findById(long id) {
        if(courseRepository.findById(id).isPresent()) {
            return courseRepository.findById(id).get();
        }
        else {
            return null;
        }
    }
    public Course CreateCourse(Course course) {
        return this.courseRepository.save(course);
    }

    public ResultPaginationDTO GetAllCourses(Pageable page) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        Page<Course> listCourse=this.courseRepository.findAll(page);

        ResultPaginationDTO.Meta meta=new ResultPaginationDTO.Meta();

        meta.setPage(page.getPageNumber()+1);
        meta.setPageSize(page.getPageSize());

        meta.setPages(listCourse.getTotalPages());
        meta.setTotal(listCourse.getTotalElements());

        result.setMeta(meta);

        result.setResult(listCourse);
        return result;
    }
    public ResultPaginationDTO GetAllCoursesByCategory(Pageable page,long idCategory) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        Page<Course> listCourse=this.courseRepository.findAllByCategoryId(page,idCategory);

        ResultPaginationDTO.Meta meta=new ResultPaginationDTO.Meta();

        meta.setPage(page.getPageNumber()+1);
        meta.setPageSize(page.getPageSize());

        meta.setPages(listCourse.getTotalPages());
        meta.setTotal(listCourse.getTotalElements());

        result.setMeta(meta);

        result.setResult(listCourse);
        return result;
    }
    @Transactional
    public void RemoveCourse(Course course) {
        if(this.tienDoRepository.countByCourse(course.getId())>0) {
            this.tienDoRepository.deleteByCourse(course.getId());
        }
        courseRepository.deleteById(course.getId());
    }

    public Course GetCourseById(Long id) {
        Optional<Course> course = this.courseRepository.findById(id);
        if(course.isPresent()) {
            return course.get();
        }else
        {
            return null;
        }
    }
    public ExerciseResponseDTO createAssessmentTest(Long courseId) {

        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null || course.getLessonList().isEmpty()) {
            throw new RuntimeException("Không tìm thấy khóa học hoặc bài học");
        }


        Lesson lesson = course.getLessonList().get(0);
        String nameTest = "Level Assessment Test " + course.getTenMon();

        TestExercise testExercise = testExerciseService.findByName(nameTest);
        if (testExercise == null) {
            testExercise = new TestExercise();
            testExercise.setName(nameTest);
            testExercise.setLesson(lesson);
        }

        List<Exercise> exerciseList = createExerciseListByCourseId(courseId, 2);
        testExercise.setExerciseList(exerciseList);
        testExercise.setDuration(exerciseList.size() + 15);
        testExerciseService.save(testExercise);

        Map<String, ExerciseResponseDTO.ExerciseGroupDTO> groupedExercises = new HashMap<>();
        for (Exercise exercise : exerciseList) {
            String questionType = exercise.getQuestionType() != null ? exercise.getQuestionType().toString() : "Unknown";
            String groupKey;

            if ("LISTENING".equals(questionType) && exercise.getListeningGroup() != null) {
                groupKey = "LISTENING_" + exercise.getListeningGroup().getId();
            } else if ("READ".equals(questionType) && exercise.getReadingPassage() != null) {
                groupKey = "READ_" + exercise.getReadingPassage().getId();
            } else {
                groupKey = questionType;
            }
            ExerciseResponseDTO.ExerciseDTO exerciseDTO = new ExerciseResponseDTO.ExerciseDTO();
            exerciseDTO.setId(exercise.getId());
            exerciseDTO.setCauHoi(exercise.getCauHoi());
            exerciseDTO.setDapAn1(exercise.getDapAn1());
            exerciseDTO.setDapAn2(exercise.getDapAn2());
            exerciseDTO.setDapAn3(exercise.getDapAn3());
            exerciseDTO.setDapAn4(exercise.getDapAn4());
            exerciseDTO.setDapAnDung(exercise.getDapAnDung() != null ? exercise.getDapAnDung().toString() : null);
            exerciseDTO.setDificulty(exercise.getDificulty() != null ? exercise.getDificulty().toString() : null);
            exerciseDTO.setQuestionType(questionType);

            ExerciseResponseDTO.ExerciseGroupDTO group = groupedExercises.computeIfAbsent(groupKey, k -> new ExerciseResponseDTO.ExerciseGroupDTO());
            group.getExercises().add(exerciseDTO);

            if ("LISTENING".equals(questionType) && exercise.getListeningGroup() != null) {
                group.setAudioFile(exercise.getListeningGroup().getAudioFile());
            } else if ("READ".equals(questionType) && exercise.getReadingPassage() != null) {
                group.setPassageId(exercise.getReadingPassage().getId());
            }
        }

        ExerciseResponseDTO responseDTO = new ExerciseResponseDTO();
        responseDTO.setData(groupedExercises);
        return responseDTO;
    }
    public List<Exercise> createExerciseListByCourseId(long courseId, int randomNumber){
        List<Exercise> listRandomExerciseByIdCourse = new ArrayList<>();

        Optional<Course> optionalCourse = courseRepository.findById(courseId);

        if (optionalCourse.isEmpty()) return listRandomExerciseByIdCourse;

        Course course = optionalCourse.get();


        for (Lesson lesson : course.getLessonList()) {
            List<Exercise> allExercises = exerciseService.findExerciseListRandomByLessonId(lesson.getId(),randomNumber);
            listRandomExerciseByIdCourse.addAll(allExercises);
        }
        return listRandomExerciseByIdCourse;
    }

    public Course_LessonResponse.Course convertToCourse_LessonResponse(Course course) {
        Course_LessonResponse.Course result = new Course_LessonResponse.Course();
        result.setId(course.getId());
        result.setName(course.getTenMon());
        result.setImage(course.getAnhMonHoc());

        return result;
    }
}

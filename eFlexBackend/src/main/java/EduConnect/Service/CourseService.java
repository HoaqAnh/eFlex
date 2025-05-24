package EduConnect.Service;


import EduConnect.Domain.Course;
import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.Course_LessonResponse;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Repository.CourseRepository;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.ProgressLessonRepository;
import EduConnect.Repository.TienDoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TienDoRepository tienDoRepository;
    private final ExerciseService exerciseService;
    private final ProgressLessonRepository progressLessonRepository;

    public CourseService(CourseRepository courseRepository, TienDoRepository tienDoRepository,
                         ExerciseService exerciseService,
                         ProgressLessonRepository progressLessonRepository) {
        this.courseRepository = courseRepository;
        this.tienDoRepository = tienDoRepository;
        this.exerciseService = exerciseService;
        this.progressLessonRepository = progressLessonRepository;
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

        return result;
    }
}

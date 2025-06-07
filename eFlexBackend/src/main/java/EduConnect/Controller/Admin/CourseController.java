package EduConnect.Controller.Admin;

import EduConnect.Domain.Course;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.Course_LessonResponse;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Service.CourseService;
import EduConnect.Service.LessonService;
import EduConnect.Service.TienDoService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Enum.StatusCourse;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class CourseController {

    private final CourseService courseService;
    private final TienDoService tienDoService;
    private final LessonService lessonService;
    public CourseController(CourseService courseService, TienDoService tienDoService,
                            LessonService lessonService) {
        this.courseService = courseService;
        this.tienDoService = tienDoService;
        this.lessonService = lessonService;
    }

    @GetMapping("/courses")
    @ApiMessage("Get all courses with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllCourses(Pageable pageable) {
        ResultPaginationDTO result = courseService.GetAllCourses(pageable);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/courses/filter/{idCategory}")
    @ApiMessage("Get all courses with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllCoursesByCategory(Pageable pageable, @PathVariable int idCategory) {
        ResultPaginationDTO result = courseService.GetAllCoursesByCategory(pageable,idCategory);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/courses/{id}")
    @ApiMessage("Get a Course")
    public ResponseEntity<Course> getCourseById(@PathVariable long id) {
        return ResponseEntity.ok(courseService.GetCourseById(id));
    }
    @PostMapping("/coursesDraft")
    @ApiMessage("Create a new course")
    public ResponseEntity<Course> createCourseDraft(@RequestBody Course requestCourse) throws IdInValidException {
        if (courseService.findByTenMon(requestCourse.getTenMon()) != null) {
            throw new IdInValidException("The course with name '" + requestCourse.getTenMon() + "' already exists.");
        }
        requestCourse.setStatusCourse(StatusCourse.DRAFT);
        Course createdCourse = courseService.CreateCourse(requestCourse);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }
    @PostMapping("/courses")
    @ApiMessage("Create a new course")
    public ResponseEntity<Course> createCourse(@RequestBody Course requestCourse) throws IdInValidException {
        if (courseService.findByTenMon(requestCourse.getTenMon()) != null) {
            throw new IdInValidException("The course with name '" + requestCourse.getTenMon() + "' already exists.");
        }
        requestCourse.setStatusCourse(StatusCourse.ACTIVE);
        Course createdCourse = courseService.CreateCourse(requestCourse);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }
    @DeleteMapping("/courses/{id}")
    @ApiMessage("Delete a course by ID")
    public ResponseEntity<Void> deleteCourse(@PathVariable("id") long id) throws IdInValidException {
        Course course = courseService.GetCourseById(id);
        if (course == null) {
            throw new IdInValidException("Course with ID " + id + " does not exist.");
        }
        this.courseService.RemoveCourse(course);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @GetMapping("/courses/studying/{userId}")
    @ApiMessage("Get List Course User Studying and studied")
    public ResponseEntity<List<Course_LessonResponse>> getListCourseUserStudying(@PathVariable long userId) {
        //Danh sach mon hoc da hoc cua User
        List<Course> listCourse = tienDoService.findListCourseByUserId(userId);
        //Danh sach Response
        List<Course_LessonResponse> course_lessonResponseList = new ArrayList<Course_LessonResponse>();


        for (Course course : listCourse) {
            //Danh sach Lesson da hoc cua User
            List<Lesson> lessonList = lessonService.findLessonByUserId(userId, course.getId());
            Set<Long> studiedLessonIds = lessonList.stream()
                    .map(Lesson::getId)
                    .collect(Collectors.toSet());
            //Danh sach mon hoc co danh dau da hoc/chua hoc
            List<Course_LessonResponse.Course.Lesson> lessonListDto = new ArrayList<>();
            for (Lesson lesson : course.getLessonList()) {
                //convert sang DTO
                Course_LessonResponse.Course.Lesson lessonDto = new Course_LessonResponse.Course.Lesson();
                lessonDto.setId(lesson.getId());
                lessonDto.setName(lesson.getTenBai());
                lessonDto.setComplete(studiedLessonIds.contains(lesson.getId()));

                lessonListDto.add(lessonDto);
            }

            Course_LessonResponse course_lesson = new Course_LessonResponse();
            course_lesson.setCourse(courseService.convertToCourse_LessonResponse(course));
            course_lesson.course.setLessonList(lessonListDto);
            course_lessonResponseList.add(course_lesson);
        }


        return ResponseEntity.ok(course_lessonResponseList);
    }

}
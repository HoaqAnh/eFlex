package EduConnect.Controller.Admin;

import EduConnect.Domain.Course;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Service.CourseService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Enum.StatusCourse;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    @ApiMessage("Get all courses with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllCourses(Pageable pageable) {
        ResultPaginationDTO result = courseService.GetAllCourses(pageable);
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
        if (course==null) {
            throw new IdInValidException("Course with ID " + id + " does not exist.");
        }

        this.courseService.RemoveCourse(course);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
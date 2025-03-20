package EduConnect.Controller.Admin;

import EduConnect.Domain.Course;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Service.CourseService;
import EduConnect.Util.ApiMessage;
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

    @PostMapping("/courses")
    @ApiMessage("Create a new course")
    public ResponseEntity<Course> createCourse(@RequestBody Course requestCourse) throws IdInValidException {
        if (courseService.findByTenMon(requestCourse.getTenMon()) != null) {
            throw new IdInValidException("The course with name '" + requestCourse.getTenMon() + "' already exists.");
        }
        Course createdCourse = courseService.CreateCourse(requestCourse);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @DeleteMapping("/courses/{id}")
    @ApiMessage("Delete a course by ID")
    public ResponseEntity<Void> deleteCourse(@PathVariable("id") long id) throws IdInValidException {
        if (this.courseService.findById(id)!=null) {
            throw new IdInValidException("Course with ID " + id + " does not exist.");
        }
        this.courseService.RemoveCourse(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
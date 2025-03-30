package EduConnect.Controller.Admin;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.LessonDTO;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Service.LessonService;
import EduConnect.Util.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class LessonController {
    private final LessonService lessonService;
    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }
    @PostMapping("/lesson")
    @ApiMessage("Create a Lesson")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {

        return ResponseEntity.ok(lessonService.createLesson(lesson));
    }
    @PostMapping("/lesson/excel/{id}")
    @ApiMessage("Create a Lesson")
    public ResponseEntity<List<Lesson>> createLessonExcel(@RequestParam("file") MultipartFile file, @PathVariable long CourseId) {

        return ResponseEntity.ok(this.lessonService.importLessons(file,CourseId));
    }
    @GetMapping("/lesson")
    @ApiMessage("Get all Lesson")
    public ResponseEntity<ResultPaginationDTO> getAllLesson(
                                                              Pageable pageable) {
        return ResponseEntity.ok(this.lessonService.getAll(pageable));
    }
    @GetMapping("/lesson/{idCourse}")
    @ApiMessage("Get Lesson By idCourse")
    public ResponseEntity<List<LessonDTO>> getLessonById(@PathVariable long idCourse) {
        return ResponseEntity.ok(this.lessonService.getLessonByCourse(idCourse));
    }
}

package EduConnect.Controller.Admin;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.TestExercise;
import EduConnect.Repository.LessonRepository;
import EduConnect.Service.LessonService;
import EduConnect.Service.TestExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/test-exercises")
public class TestExerciseController {

    private final TestExerciseService testExerciseService;
    private final LessonRepository lessonRepository;

    @Autowired
    public TestExerciseController(TestExerciseService testExerciseService, LessonRepository lessonRepository) {
        this.testExerciseService = testExerciseService;
        this.lessonRepository = lessonRepository;
    }
    @PostMapping
    public ResponseEntity<TestExercise> createTestExercise(@RequestBody TestExercise testExercise) {
        TestExercise createdTestExercise = testExerciseService.createTestExercise(testExercise);
        return new ResponseEntity<>(createdTestExercise, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestExercise> updateTestExercise(@PathVariable Long id, @RequestBody TestExercise testExercise) {
        TestExercise updatedTestExercise = testExerciseService.updateTestExercise(id, testExercise);
        return new ResponseEntity<>(updatedTestExercise, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestExercise(@PathVariable Long id) {
        testExerciseService.deleteTestExercise(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/{id}")
    public ResponseEntity<TestExercise> getTestExercise(@PathVariable Long id) {
        TestExercise testExercise = testExerciseService.getTestExerciseById(id);
        return new ResponseEntity<>(testExercise, HttpStatus.OK);
    }

    @GetMapping("/lesson/{id}")
    public ResponseEntity<List<TestExercise>> getTestExercisesByLesson(@PathVariable Long id) {
        Lesson lesson = lessonRepository.getLessonById(id);

        return new ResponseEntity<>(lesson.getTestExercise(), HttpStatus.OK);
    }
    @GetMapping("/{idLessonn}")
    public ResponseEntity<List<TestExercise>> getTestExerciseByLessonn(@PathVariable Long idLessonn) {
        return ResponseEntity.ok(this.testExerciseService.getTestByLesson(idLessonn));
    }
}
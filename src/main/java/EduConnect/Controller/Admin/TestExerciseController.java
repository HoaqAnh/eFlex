package EduConnect.Controller.Admin;

import EduConnect.Domain.TestExercise;
import EduConnect.Service.TestExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/test-exercises")
public class TestExerciseController {

    private final TestExerciseService testExerciseService;

    @Autowired
    public TestExerciseController(TestExerciseService testExerciseService) {
        this.testExerciseService = testExerciseService;
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
}
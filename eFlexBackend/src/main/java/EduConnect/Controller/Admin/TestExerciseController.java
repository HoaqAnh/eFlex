package EduConnect.Controller.Admin;

import EduConnect.Domain.Course;
import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.TestExercise;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.LessonRepository;
import EduConnect.Service.CourseService;
import EduConnect.Service.ExerciseService;
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
    private final ExerciseService exerciseService;
    private final CourseService courseService;

    @Autowired
    public TestExerciseController(TestExerciseService testExerciseService,
                                  LessonRepository lessonRepository,
                                  ExerciseService exerciseService,
                                  CourseService courseService) {
        this.testExerciseService = testExerciseService;
        this.lessonRepository = lessonRepository;
        this.exerciseService = exerciseService;
        this.courseService = courseService;
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
    @GetMapping("/lesson/{idLesson}")
    public ResponseEntity<List<TestExercise>> getTestExerciseByLessonn(@PathVariable Long idLesson) {
        Lesson lesson=lessonRepository.getLessonById(idLesson);
        List<TestExercise> testExerciseList = this.testExerciseService.getTestByLesson(idLesson,lesson.getCourse().getTenMon());
        return ResponseEntity.ok(testExerciseList);
    }
    @GetMapping("/assessmentTest/{courseId}")
    public ResponseEntity<TestExercise> getRandomTestExerciseByCourseId(@PathVariable Long courseId) {
        Course course = courseService.findById(courseId);
        long lessonId = course.getLessonList().get(0).getId();
        Lesson lesson = lessonRepository.findById(lessonId).get();
        String nameTest = "Level Assessment Test " + course.getTenMon();
        TestExercise testExercise=this.testExerciseService.findByName(nameTest);
        if(this.testExerciseService.findByName(nameTest)==null)
        {
            TestExercise newTestExercise = new TestExercise();
            newTestExercise.setName(nameTest);

            List<Exercise> exerciseList = courseService.createExerciseListByCourseId(courseId, 2);
            newTestExercise.setExerciseList(exerciseList);
            newTestExercise.setLesson(lesson);
            newTestExercise.setDuration(exerciseList.size() + 15);
            testExerciseService.save(newTestExercise);
            return new ResponseEntity<>(newTestExercise, HttpStatus.CREATED);
        }
        List<Exercise> exerciseList = courseService.createExerciseListByCourseId(courseId, 2);
        testExercise.setExerciseList(exerciseList);
        testExercise.setDuration(exerciseList.size() + 15);
        testExerciseService.save(testExercise);
        return new ResponseEntity<>(testExercise, HttpStatus.OK);
    }

}
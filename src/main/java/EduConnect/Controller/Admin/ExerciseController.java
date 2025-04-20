package EduConnect.Controller.Admin;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.Response.ScoreRes;
import EduConnect.Service.ExerciseService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Enum.Dificulty;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ExerciseController {
    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }
    @PostMapping("/exercise/excel/{idLesson}")
    @ApiMessage("Excel for Exercise")
    public  ResponseEntity<List<Exercise>> getExercise(@PathVariable int idLesson,@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(this.exerciseService.excelExercise(file,idLesson));
    }
    @PostMapping("/exercise")
    public ResponseEntity<Exercise> createExercise(@RequestBody  Exercise exercise) {
        return ResponseEntity.ok(exerciseService.save(exercise));
    }
    @PutMapping("/exercise/{id}")
    public ResponseEntity<Exercise> updateExercise(
            @PathVariable("id") Long id,
            @RequestBody  Exercise exercise) throws IdInValidException {
        Exercise existingExercise = exerciseService.findById(id)
                .orElseThrow(() -> new IdInValidException("Exercise not found with id: " + id));

        existingExercise.setCauHoi(exercise.getCauHoi());
        existingExercise.setDapAn1(exercise.getDapAn1());
        existingExercise.setDapAn2(exercise.getDapAn2());
        existingExercise.setDapAn3(exercise.getDapAn3());
        existingExercise.setDapAn4(exercise.getDapAn4());
        existingExercise.setDapAnDung(exercise.getDapAnDung());
        existingExercise.setDificulty(exercise.getDificulty());
        if (exercise.getLesson() != null) {
            existingExercise.setLesson(exercise.getLesson());
        }

        return ResponseEntity.ok(exerciseService.save(existingExercise));
    }

    @DeleteMapping("/exercise/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable("id") Long id) throws IdInValidException {
        if (!exerciseService.existsById(id)) {
            throw new IdInValidException("Exercise not found with id: " + id);
        }
        exerciseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exercise/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable("id") Long id) throws IdInValidException {
        Exercise exercise = exerciseService.findById(id)
                .orElseThrow(() -> new IdInValidException("Exercise not found with id: " + id));
        return ResponseEntity.ok(exercise);
    }

    @GetMapping("/lesson/{lessonId}/exercises")
    public ResponseEntity<List<Exercise>> getExercisesByLesson(
            @PathVariable("lessonId") Long lessonId)
           {

        return ResponseEntity.ok(exerciseService.findByLessonId(lessonId));
    }

    @GetMapping("/exercises")
    public ResponseEntity<Page<Exercise>> getExercisesByDifficulty(
            @RequestParam(required = false) Dificulty dificulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        Sort sortOrder = Sort.by(sort[1].equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC, sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        if (dificulty != null) {
            return ResponseEntity.ok(exerciseService.findByDificulty(dificulty, pageable));
        }

        return ResponseEntity.ok(exerciseService.findAll(pageable));
    }
    @PostMapping("/toScore/{idLesson}")
    public ResponseEntity<ScoreRes> scoreExercises(
            @PathVariable Long idLesson,
            @RequestBody List<AnswerRequest> answerRequests) {
        ScoreRes scoreRes = exerciseService.scoreExercises(idLesson, answerRequests);
        return ResponseEntity.ok(scoreRes);
    }
}
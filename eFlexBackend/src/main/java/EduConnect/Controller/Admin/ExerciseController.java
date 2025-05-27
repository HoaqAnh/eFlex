package EduConnect.Controller.Admin;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.Response.ScoreRes;
import EduConnect.Domain.TestExercise;
import EduConnect.Repository.TestExerciseRepository;
import EduConnect.Service.ExerciseService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Enum.Dificulty;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class ExerciseController {
    private final ExerciseService exerciseService;
    private final TestExerciseRepository testExerciseRepository;

    public ExerciseController(ExerciseService exerciseService,
                              TestExerciseRepository testExerciseRepository) {
        this.exerciseService = exerciseService;
        this.testExerciseRepository = testExerciseRepository;
    }
    @PostMapping("/exercise/excel/{idTestExercise}")
    @ApiMessage("Excel for Exercise")
    public  ResponseEntity<List<Exercise>> getExercise(@PathVariable long idTestExercise,@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(this.exerciseService.excelExercise(file,idTestExercise));
    }
    @PostMapping("/exercise/excel")
    @ApiMessage("Excel for Exercise")
    public  ResponseEntity<List<Exercise>> createExerciseForListening(@RequestParam(name = "id_TestExercise") Long idTestExercise
            ,@RequestParam("id_Listening") Long idListening,@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(this.exerciseService.excelforListening(file,idListening,idListening));
    }
    @PostMapping("/exercise")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {

        exercise.setId_BaiHoc(exercise.getId_BaiHoc());
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
        existingExercise.setId_BaiHoc(exercise.getId_BaiHoc());
        if (exercise.getTestExercise() != null) {
            existingExercise.setTestExercise(exercise.getTestExercise());
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

    @GetMapping("/lesson/{testExerciseId}/exercises")
    public ResponseEntity<List<Exercise>> getExercisesByLesson(
            @PathVariable("testExerciseId") Long testExerciseId)
           {

        return ResponseEntity.ok(exerciseService.findByTestExerciseId(testExerciseId));
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

    @PostMapping("/toScore/{testExerciseId}")
    public ResponseEntity<ScoreRes> scoreExercises(
            @PathVariable Long testExerciseId,
            @RequestBody List<AnswerRequest> answerRequests) {
        ScoreRes scoreRes = exerciseService.scoreExercises(testExerciseId, answerRequests);
        return ResponseEntity.ok(scoreRes);
    }
}
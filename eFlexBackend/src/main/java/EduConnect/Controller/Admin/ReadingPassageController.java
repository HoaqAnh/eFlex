package EduConnect.Controller.Admin;


import EduConnect.Domain.Exercise;
import EduConnect.Domain.ReadingPassage;
import EduConnect.Domain.Response.ReadingPassageResponse;
import EduConnect.Service.ExerciseService;
import EduConnect.Service.ReadingPassageService;
import EduConnect.Util.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ReadingPassageController {
    private final ReadingPassageService readingPassageService;
    private final ExerciseService exerciseService;
    public ReadingPassageController (ReadingPassageService readingPassageService, ExerciseService exerciseService) {
        this.readingPassageService = readingPassageService;
        this.exerciseService = exerciseService;
    }
    @PostMapping("/readingPassage")
    @ApiMessage("Create a New Reading Passage")
    public ResponseEntity<ReadingPassage> createNewReadingPassage(@RequestBody ReadingPassage readingPassage) {
        return ResponseEntity.ok(this.readingPassageService.save(readingPassage));
    }

    @GetMapping("/readingPassage/{id}")
    @ApiMessage("Get List Exercise By Reading Passage's Id")
    public ResponseEntity<List<Exercise>> getListExerciseByReadingPassage(@PathVariable(value = "id") long id) {
        List<Exercise> exerciseList = exerciseService.findByReadingPassage(id);
        return ResponseEntity.ok(exerciseList);
    }

    @GetMapping("/readingPassage/testExercise/{idTestExercise}")
    @ApiMessage("Get List ReadingPassage By TestExercise's Id")
    public ResponseEntity<List<ReadingPassage>> getListReadingPassageByIdTestExercise(@PathVariable(value = "idTestExercise") long idTestExercise) {
        List<ReadingPassage> readingPassageList = readingPassageService.findReadingPassagesByTestId(idTestExercise);
        return ResponseEntity.ok(readingPassageList);
    }

    @GetMapping("/readingPassage/exercise/{idTestExercise}")
    @ApiMessage("Get List<ReadingPassage<Exercise>> By TestExercise's Id")
    public ResponseEntity<List<ReadingPassageResponse>> getReadingPassageAndExerciseByIdTest(@PathVariable(value = "idTestExercise") long idTestExercise) {
        List<ReadingPassageResponse> readingPassageResponses = new ArrayList<>();
        List<ReadingPassage> readingPassageList = readingPassageService.findReadingPassagesByTestId(idTestExercise);
        System.out.println("Size of Danh sach Reading Passage: " + readingPassageList.size());
        for (ReadingPassage readingPassage : readingPassageList) {
            ReadingPassageResponse readingPassageResponse = new ReadingPassageResponse();
            List<ReadingPassageResponse.Exercise> exerciseResponseList = new ArrayList<>();
            List<Exercise> exerciseList = exerciseService.findByReadingPassageIdEachTestExercise(readingPassage.getId(), idTestExercise);
            System.out.println("Size of Danh sach Reading Passage: " + exerciseList.size());
            //map qua ReadingPassage
            readingPassageResponse.setTitle(readingPassage.getTitle());
            readingPassageResponse.setContent(readingPassage.getContent());

            for (Exercise exercise : exerciseList) {
                ReadingPassageResponse.Exercise exerciseResponse = new ReadingPassageResponse.Exercise();
                exerciseResponse = readingPassageService.mapExercise(exercise);
                exerciseResponseList.add(exerciseResponse);
            }
            readingPassageResponse.setExerciseList(exerciseResponseList);
            readingPassageResponses.add(readingPassageResponse);
        }
        return ResponseEntity.ok(readingPassageResponses);
    }

}

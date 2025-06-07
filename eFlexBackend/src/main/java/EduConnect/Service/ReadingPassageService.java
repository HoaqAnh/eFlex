package EduConnect.Service;

import EduConnect.Domain.Exercise;
import EduConnect.Domain.ReadingPassage;
import EduConnect.Domain.Response.ReadingPassageResponse;
import EduConnect.Repository.ReadingPassageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReadingPassageService {
    private final ReadingPassageRepository readingPassageRepository;
    public ReadingPassageService(ReadingPassageRepository readingPassageRepository) {
        this.readingPassageRepository = readingPassageRepository;
    }
    public List<ReadingPassage> findAll() {
        return readingPassageRepository.findAll();
    }
    public ReadingPassage findById(long id) {
        return readingPassageRepository.findById(id).orElse(null);
    }
    public ReadingPassage save(ReadingPassage readingPassage) {
        return readingPassageRepository.save(readingPassage);
    }
    public List<ReadingPassage> findReadingPassagesByTestId(long testExerciseId){
        return readingPassageRepository.findReadingPassagesByTestExerciseId(testExerciseId);
    }
    public ReadingPassageResponse.Exercise mapExercise(Exercise exercise) {
        ReadingPassageResponse.Exercise exerciseResponse = new ReadingPassageResponse.Exercise();
        exerciseResponse.setCauHoi(exercise.getCauHoi());
        exerciseResponse.setDapAn1(exercise.getDapAn1());
        exerciseResponse.setDapAn2(exercise.getDapAn2());
        exerciseResponse.setDapAn3(exercise.getDapAn3());
        exerciseResponse.setDapAn4(exercise.getDapAn4());
        exerciseResponse.setDapAnDung(exercise.getDapAnDung());
        return exerciseResponse;
    }

}

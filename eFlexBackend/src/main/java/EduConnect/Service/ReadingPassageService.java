package EduConnect.Service;

import EduConnect.Domain.ReadingPassage;
import EduConnect.Repository.ReadingPassageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadingPassageService {
    private final ReadingPassageRepository readingPassageRepository;
    public ReadingPassageService(ReadingPassageRepository readingPassageRepository) {
        this.readingPassageRepository = readingPassageRepository;
    }
    public List<ReadingPassage> findAll() {
        return readingPassageRepository.findAll();
    }

}

package EduConnect.Service;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.Section;
import EduConnect.Repository.SectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SectionService {
    private final SectionRepository sectionRepository;
    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    @Transactional
    public Section save(Section section) {
        return sectionRepository.save(section);
    }

    public Optional<Section> findById(Long id) {
        return sectionRepository.findById(id);
    }


    public boolean existsById(Long id) {
        return sectionRepository.existsById(id);
    }

    @Transactional
    public void deleteById(Long id) {
        sectionRepository.deleteById(id);
    }
    public Section findByLessonId(Long lessonId) {
        return sectionRepository.findByLessonId(lessonId);
    }

}

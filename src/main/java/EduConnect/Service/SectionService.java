package EduConnect.Service;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.Section;
import EduConnect.Repository.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionService {
    private final SectionRepository sectionRepository;
    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    public Section save(Section section) {
        Integer maxViTri = sectionRepository.findMaxViTriBySectionId(section.getLesson().getId());
        int nextViTri = (maxViTri == null) ? 0 : maxViTri + 1;

        section.setViTri(nextViTri);
        return sectionRepository.save(section);
    }

    public Section findById(long id) {
        return sectionRepository.findById(id);
    }

    public List<Section> findAll() {
        return sectionRepository.findAll();
    }

    public void deleteSectionById(long id) {
        this.sectionRepository.deleteById(id);
    }
}

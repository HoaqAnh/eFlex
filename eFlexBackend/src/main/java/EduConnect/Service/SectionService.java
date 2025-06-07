package EduConnect.Service;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.Request.SectionRequest;
import EduConnect.Domain.Section;
import EduConnect.Repository.LessonRepository;
import EduConnect.Repository.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SectionService {
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    public SectionService(SectionRepository sectionRepository, LessonRepository lessonRepository) {
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
    }

    public Section save(SectionRequest sectionRequest) {
        Lesson lesson=this.lessonRepository.findById(sectionRequest.getLesson().getId()).orElse(null);
        Section section=new Section();
        section.setLesson(lesson);
        section.setTenBai(sectionRequest.getTenBai());
        section.setMoTa(sectionRequest.getMoTa());
        section.setVideo(sectionRequest.getVideo());
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

    public List<Section> saveList(List<SectionRequest> sectionListDto) {

        List<Section> sectionList = new ArrayList<Section>();
        for (SectionRequest section : sectionListDto) {

            Section section1 = this.save(section);
            sectionList.add(section1);
        }
        return sectionList;
    }
}

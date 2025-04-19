package EduConnect.Controller.Admin;

import EduConnect.Domain.Lesson;
import EduConnect.Domain.Section;
import EduConnect.Repository.LessonRepository;
import EduConnect.Service.SectionService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/v1/")
public class SectionController {
    private final SectionService sectionService;
    private final LessonRepository lessonRepository;
    public SectionController(SectionService sectionService, LessonRepository lessonRepository) {
        this.sectionService = sectionService;
        this.lessonRepository = lessonRepository; ;
    }
    @PostMapping("/section")
    @ApiMessage("Create a Section")
    public ResponseEntity<Section> createSection(@RequestBody Section section) {
        return ResponseEntity.ok(this.sectionService.save(section));
    }

    @PostMapping("/Listsection")
    @ApiMessage("Create List Section")
    public ResponseEntity<List<Section>> createListSection(@RequestBody List<Section> section) {
        return ResponseEntity.ok(this.sectionService.saveList(section));
    }

    @GetMapping("/{idLesson}/Listsection")
    @ApiMessage("Get List Section")
    public ResponseEntity<List<Section>> getListSection(@PathVariable("idLesson") int idLesson) throws IdInValidException {
        Lesson lesson = lessonRepository.getLessonById(idLesson);
        if (lesson == null) {
            throw new IdInValidException("Lesson not Exists");
        }
        List<Section> sectionList = new ArrayList<>();
        for (Section section : lesson.getSections()) {
            sectionList.add(section);
        }
        return ResponseEntity.ok(sectionList);
    }
}

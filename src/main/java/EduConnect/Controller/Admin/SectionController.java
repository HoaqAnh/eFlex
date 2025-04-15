package EduConnect.Controller.Admin;

import EduConnect.Domain.Section;
import EduConnect.Service.SectionService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/")
public class SectionController {
    private final SectionService sectionService;
    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }
    @PostMapping("/section")
    @ApiMessage("Create a Section")
    public ResponseEntity<Section> createSection(@RequestBody Section section) {
        return ResponseEntity.ok(this.sectionService.save(section));
    }
    @PutMapping("/section/{id}")
    @ApiMessage("Update a Section")
    public ResponseEntity<Section> updateSection(
            @PathVariable("id") Long id,
            @RequestBody Section section) throws IdInValidException {
        Section existingSection = sectionService.findById(id)
                .orElseThrow(() -> new IdInValidException("Section not found with id: " + id));

        existingSection.setTenBai(section.getTenBai());
        existingSection.setMoTa(section.getMoTa());
        existingSection.setVideo(section.getVideo());
        existingSection.setFile(section.getFile());
        existingSection.setViTri(section.getViTri());

        if (section.getLesson() != null) {
            existingSection.setLesson(section.getLesson());
        }

        return ResponseEntity.ok(sectionService.save(existingSection));
    }

    @DeleteMapping("/section/{id}")
    @ApiMessage("Delete a Section")
    public ResponseEntity<Void> deleteSection(@PathVariable("id") Long id) throws IdInValidException {
        if (!sectionService.existsById(id)) {
            throw new IdInValidException("Section not found with id: " + id);
        }
        sectionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/section/{id}")
    @ApiMessage("Get a Section by ID")
    public ResponseEntity<Section> getSectionById(@PathVariable("id") Long id) throws IdInValidException {
        Section section = sectionService.findById(id)
                .orElseThrow(() -> new IdInValidException("Section not found with id: " + id));
        return ResponseEntity.ok(section);
    }

    @GetMapping("/lesson/{lessonId}/sections")
    @ApiMessage("Get Sections by Lesson ID")
    public ResponseEntity<Section> getSectionsByLesson(
            @PathVariable("lessonId") Long lessonId) {
        Section sections = sectionService.findByLessonId(lessonId);
        return ResponseEntity.ok(sections);
    }
}

package EduConnect.Controller.Admin;

import EduConnect.Domain.Section;
import EduConnect.Service.SectionService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/section")
    @ApiMessage("Get Sections")
    public ResponseEntity<List<Section>> getAllSections() {
        return ResponseEntity.ok(sectionService.findAll());
    }

    @GetMapping("/section/{id}")
    @ApiMessage("Get a Section")
    public ResponseEntity<Section> getSection(@PathVariable("id") long id) throws IdInValidException {
        Section section = this.sectionService.findById(id);
        if (section == null) {
            throw new IdInValidException("Section not Found");
        }
        return ResponseEntity.ok(section);
    }

    @PutMapping("/section/{id}")
    @ApiMessage("Update Section")
    public ResponseEntity<Section> updateSection(@RequestBody Section section,
                                                 @PathVariable("id") long id) throws IdInValidException {
        Section updateSection = sectionService.findById(id);
        if (updateSection == null) {
            throw new IdInValidException("Section Not Found");
        }
        updateSection.setTenBai(section.getTenBai());
        updateSection.setMoTa(section.getMoTa());
        updateSection.setMoTa(section.getMoTa());
        updateSection.setVideo(section.getVideo());
        updateSection.setFile(section.getFile());
        return ResponseEntity.ok(this.sectionService.save(updateSection));
    }

    @DeleteMapping("/section/{id}")
    @ApiMessage("Delete a Section")
    public ResponseEntity<Void> deleteSection(@PathVariable("id") long id) throws IdInValidException {
        Section deleteSection = sectionService.findById(id);
        if (deleteSection == null) {
            throw new IdInValidException("Section with id: "+ id + " Not Found" );
        }
        sectionService.deleteSectionById(id);
        return ResponseEntity.ok().build();
    }
}

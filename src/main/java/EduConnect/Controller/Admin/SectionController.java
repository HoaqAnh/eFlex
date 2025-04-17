package EduConnect.Controller.Admin;

import EduConnect.Domain.Section;
import EduConnect.Service.SectionService;
import EduConnect.Util.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/Listsection")
    @ApiMessage("Create List Section")
    public ResponseEntity<List<Section>> createListSection(@RequestBody List<Section> section) {
        return ResponseEntity.ok(this.sectionService.saveList(section));
    }

}

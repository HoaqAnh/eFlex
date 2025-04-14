package EduConnect.Controller.Admin;

import EduConnect.Domain.Section;
import EduConnect.Service.SectionService;
import EduConnect.Util.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

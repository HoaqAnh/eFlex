package EduConnect.Controller.User;

import EduConnect.Domain.ProgressSection;
import EduConnect.Domain.Response.ProgressSectionDTO;
import EduConnect.Domain.User;
import EduConnect.Repository.UserRepository;
import EduConnect.Service.ProgressService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Error.IdInValidException;
import EduConnect.Util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ProgressSectionController {
    private final ProgressService progressService;
    private final UserRepository userRepository;
    public ProgressSectionController(ProgressService progressService, UserRepository userRepository) {
        this.progressService = progressService;
        this.userRepository = userRepository;
    }
    @PostMapping("/progressSection")
    @ApiMessage("Createe ProgressSction")
    public ResponseEntity<ProgressSectionDTO> createProgressSection(@RequestBody ProgressSection progressSection)   {
        String email = SecurityUtil.getCurrentUserLogin().get();
        User currentUser = userRepository.findByEmail(email);
        progressSection.setUser(currentUser);
        ProgressSection progressSection1=this.progressService.findByUserIdAndSectionID(currentUser.getId(), progressSection.getSection().getId());
        if(progressSection1!=null)
        {
            return ResponseEntity.ok(progressService.DataToDTO(progressSection1));
        }
        return ResponseEntity.ok(progressService.createProgressSection(currentUser,progressSection));
    }
    @GetMapping("/progressSectionCheck/{idNgDung}/{idSection}")
    @ApiMessage("Check Seciton")
    public ResponseEntity<Boolean> checkProgressSection(@PathVariable Long idNgDung, @PathVariable Long idSection)  {
        return ResponseEntity.ok(progressService.checkProgressSection(idNgDung,idSection));
    }
    @GetMapping("/progressLessonCheck/{idNgDung}/{idLesson}")
    @ApiMessage("Check Seciton")
    public ResponseEntity<Boolean> checkProgressLesson(@PathVariable Long idNgDung, @PathVariable Long idLesson)  {
        return ResponseEntity.ok(progressService.checkProgressLesson(idNgDung,idLesson));
    }

}

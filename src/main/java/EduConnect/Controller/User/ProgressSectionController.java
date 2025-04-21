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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<ProgressSectionDTO> createProgressSection(@RequestBody ProgressSection progressSection) throws IdInValidException {
        String email = SecurityUtil.getCurrentUserLogin().get();
        User currentUser = userRepository.findByEmail(email);
        progressSection.setUser(currentUser);
        if(progressService.existsByUser_IdAndSection_Id(currentUser.getId(),progressSection.getSection().getId())==true)
        {
            throw new IdInValidException("ProgressSection already exists");
        }
        return ResponseEntity.ok(progressService.createProgressSection(currentUser,progressSection));
    }
}

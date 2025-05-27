package EduConnect.Controller.Admin;

import EduConnect.Domain.ListeningGroup;
import EduConnect.Service.ListeningService;
import EduConnect.Util.ApiMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1")
public class ListeningController {
    private final ListeningService listeningService;
    public ListeningController(ListeningService listeningService) {
        this.listeningService = listeningService;
    }
    @PostMapping("/listeningGroup")
    @ApiMessage("Create a new ListeningGroup")
    public ResponseEntity<ListeningGroup> createListeningGroup(@RequestBody ListeningGroup listeningGroup) {
        return ResponseEntity.ok(this.listeningService.addListeningGroup(listeningGroup));
    }
    @GetMapping("/listeningGroup/{id}/audio")
    @ApiMessage("Download audio file for a ListeningGroup")
    public ResponseEntity<?> downloadAudioFile(@PathVariable("id") Long listeningGroupId) throws IOException {
        ListeningGroup listeningGroup = listeningService.findByListeningId(listeningGroupId);

        if (listeningGroup.getAudioFile() == null) {
            throw new IllegalArgumentException("Audio file not found for ListeningGroup with ID: " + listeningGroupId);
        }
        return ResponseEntity.ok()
                .body(listeningGroup.getAudioFile());
    }

}

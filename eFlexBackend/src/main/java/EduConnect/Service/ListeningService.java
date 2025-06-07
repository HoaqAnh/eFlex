package EduConnect.Service;

import EduConnect.Domain.ListeningGroup;
import EduConnect.Repository.ListeningGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ListeningService {

    private final ListeningGroupRepository listeningGroupRepository;

    private static final String UPLOAD_DIR = "/app/uploads/audio/";

    @Autowired
    public ListeningService(ListeningGroupRepository listeningGroupRepository) {
        this.listeningGroupRepository = listeningGroupRepository;

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    @Transactional
    public ListeningGroup addListeningGroup(ListeningGroup listeningGroup) {

        return listeningGroupRepository.save(listeningGroup);
    }
    public ListeningGroup findByListeningId(Long listeningId) {
        return this.listeningGroupRepository.findById(listeningId).orElse(null);
    }
    @Transactional
    public ListeningGroup uploadAudioFile(Long listeningGroupId, MultipartFile audioFile) throws IOException {
        ListeningGroup listeningGroup = listeningGroupRepository.findById(listeningGroupId)
                .orElseThrow(() -> new IllegalArgumentException("ListeningGroup not found with ID: " + listeningGroupId));

        if (audioFile == null || audioFile.isEmpty()) {
            throw new IllegalArgumentException("Audio file cannot be empty");
        }

        String originalFileName = audioFile.getOriginalFilename();
        String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : ".mp3";
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        Path filePath = Paths.get(UPLOAD_DIR + newFileName);
        Files.write(filePath, audioFile.getBytes());

        listeningGroup.setAudioFile(filePath.toString());
        return listeningGroupRepository.save(listeningGroup);
    }



    public boolean checkAudioFileExists(String filePath) {
        Path path = Paths.get(filePath);
        return Files.exists(path);
    }
}
package EduConnect.Controller;

import EduConnect.Domain.Course;
import EduConnect.Domain.Response.ImageResponse;
import EduConnect.Domain.Response.VideoResponse;
import EduConnect.Domain.Section;
import EduConnect.Repository.CourseRepository;
import EduConnect.Repository.SectionRepository;
import EduConnect.Service.CloudinaryService;
import EduConnect.Util.Error.IdInValidException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/")
public class FileUploadController {
    private final CloudinaryService cloudinaryService;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;

    public FileUploadController(CloudinaryService cloudinaryService,
                                CourseRepository courseRepository,
                                SectionRepository sectionRepository) {
        this.cloudinaryService = cloudinaryService;
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
    }

    @PostMapping("/upload/course-image")
    public ResponseEntity<ImageResponse> uploadCourseImage(@RequestParam("file") MultipartFile file) throws IdInValidException {
        try {
            // 1. Upload ảnh lên Cloudinary
            String imageUrl = (String)cloudinaryService.uploadFile(file, "courses").get("secure_url");
            ImageResponse imageResponse = new ImageResponse();
            imageResponse.setImageUrl(imageUrl+"_"+ System.currentTimeMillis());
            // 3. Trả về phản hồi
            return ResponseEntity.ok(imageResponse);
        } catch (IOException e) {
            throw new IdInValidException(e.getMessage());
        }
    }

    @GetMapping("/course/{id}/image")
    public ResponseEntity<?> getCourseImage(@PathVariable Long id) throws IdInValidException {
        Optional<Course> course = courseRepository.findById(id);

        if (course.isPresent()) {
            Course existingCourse = course.get();
            String storedImageUrl = existingCourse.getAnhMonHoc();

            if (storedImageUrl != null && !storedImageUrl.isEmpty()) {
                // Tách link ảnh gốc trước dấu "_"
                String originalImageUrl = storedImageUrl.split("_")[0];

                // Kiểm tra xem ảnh có tồn tại trên Cloudinary không
                if (cloudinaryService.imageExists(originalImageUrl)) {
                    ImageResponse imageResponse = new ImageResponse();
                    imageResponse.setImageUrl(originalImageUrl);
                    return ResponseEntity.ok(imageResponse);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found on Cloudinary.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No image found for this course.");
            }
        } else {
            throw new IdInValidException("Course Not Found");
        }
    }

    @PostMapping("/upload/course-video")
    public ResponseEntity<VideoResponse> uploadVideo(@RequestParam("file") MultipartFile file  /*,@RequestParam("folder") String folderName*/) throws IOException, IdInValidException {
        try {
            // 1. Upload ảnh lên Cloudinary
            String videoUrl = (String)cloudinaryService.uploadVideo(file, "courses").get("secure_url");
            VideoResponse videoResponse = new VideoResponse();
            videoResponse.setVideoUrl(videoUrl+"_"+ System.currentTimeMillis());
            // 3. Trả về phản hồi
            return ResponseEntity.ok(videoResponse);
        } catch (IOException e) {
            throw new IdInValidException(e.getMessage());
        }
    }

    @GetMapping("/section/{id}/video")
    public ResponseEntity<?> getVideoSection(@PathVariable Long id) throws IdInValidException {
        Section section = sectionRepository.findById(id);
        if (section != null)
            if (section.getVideo() != null) {
                String videoUrl = section.getVideo().toString().split("_")[0];
                if (cloudinaryService.videoExists(videoUrl)) {
                    VideoResponse videoResponse = new VideoResponse();
                    videoResponse.setVideoUrl(videoUrl);
                    return ResponseEntity.ok(videoResponse);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found on Cloudinary.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No video found for this Section.");
            }
        throw new IdInValidException("Section Not Found");
    }
    @PostMapping("/upload/listening-audio")
    public ResponseEntity<?> uploadAudioFile(@RequestParam("file") MultipartFile file) throws IdInValidException {
        try {
            String audioUrl = (String) cloudinaryService.uploadAudio(file, "listening").get("secure_url");

            VideoResponse audioResponse = new VideoResponse();
            audioResponse.setVideoUrl(audioUrl + "_" + System.currentTimeMillis());
            return ResponseEntity.ok(audioResponse);
        } catch (IOException e) {
            throw new IdInValidException("Failed to upload audio file: " + e.getMessage());
        }
    }

}

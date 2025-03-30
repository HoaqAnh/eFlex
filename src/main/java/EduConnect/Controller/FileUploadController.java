package EduConnect.Controller;

import EduConnect.Domain.Course;
import EduConnect.Domain.Response.ImageResponse;
import EduConnect.Repository.CourseRepository;
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

    public FileUploadController(CloudinaryService cloudinaryService,
                                CourseRepository courseRepository) {
        this.cloudinaryService = cloudinaryService;
        this.courseRepository = courseRepository;
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



}

package EduConnect.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map uploadFile(MultipartFile file, String folderName) throws IOException {
        return cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folderName
                ));
    }

    public boolean imageExists(String imageUrl) {
        try {
            // Lấy public_id từ URL ảnh
            String publicId = extractPublicId(imageUrl);

            // Gọi API Cloudinary để lấy thông tin ảnh
            Map result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());

            return result != null; // Nếu có phản hồi tức là ảnh tồn tại
        } catch (Exception e) {
            return false; // Nếu lỗi tức là ảnh không tồn tại
        }
    }

    private String extractPublicId(String imageUrl) {
        // Giả sử ảnh có dạng: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image_name.jpg
        // Ta cần lấy "folder/image_name"
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1]; // Lấy tên file gốc (image_name.jpg)
        return imageUrl.replace("https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/", "")
                .replace("/" + fileName, "");
    }

    public Map uploadVideo(MultipartFile file, String folderName) throws IOException {
        return cloudinary.uploader().uploadLarge(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "folder", folderName
                ));
    }
    public Map uploadAudio(MultipartFile file, String folderName) throws IOException {
        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "video",  // rất quan trọng!
                "folder", folderName
        ));
    }

    public boolean videoExists(String videoUrl) {
        try {
            // Tách publicId từ video URL
            String publicId = extractPublicIdFromUrl(videoUrl);
            if (publicId == null) return false;

            // Gọi Cloudinary Admin API để kiểm tra
            Map result = cloudinary.api().resource(publicId, ObjectUtils.asMap(
                    "resource_type", "video"
            ));

            return result != null;
        } catch (Exception e) {
            // Nếu không tìm thấy hoặc lỗi => video không tồn tại
            return false;
        }
    }

    private String extractPublicIdFromUrl(String url) {
        try {
            // Ví dụ URL: https://res.cloudinary.com/demo/video/upload/folder/my_video.mp4
            String[] parts = url.split("/video/upload/");
            if (parts.length < 2) return null;

            String filePath = parts[1]; // folder/my_video.mp4 hoặc my_video.mp4
            if (filePath.contains(".")) {
                return filePath.substring(0, filePath.lastIndexOf('.')); // bỏ đuôi .mp4
            }
            return filePath;
        } catch (Exception e) {
            return null;
        }
    }
}

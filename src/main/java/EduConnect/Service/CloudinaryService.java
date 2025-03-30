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

}

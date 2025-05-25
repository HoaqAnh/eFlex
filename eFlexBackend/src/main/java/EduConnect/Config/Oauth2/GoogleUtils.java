package EduConnect.Config.Oauth2;

import EduConnect.Config.Oauth2.oauth2.GooglePojo;
import EduConnect.Domain.User;
import EduConnect.Repository.UserRepository;
import EduConnect.Util.Enum.AuthProvider;
import EduConnect.Util.Enum.Enable;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Component
public class GoogleUtils {

    private static final Logger logger = LoggerFactory.getLogger(GoogleUtils.class);

    private final RestTemplate restTemplate; // Thay WebClient bằng RestTemplate
    private final UserRepository userRepository;
    private final ObjectMapper mapper;

    @Value("${google.link.get.token}")
    private String link;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Value("${google.link.get.user_info}")
    private String userInfoUrl;

    public GoogleUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate(); // Khởi tạo RestTemplate
        this.mapper = new ObjectMapper();
    }

    public String getToken(final String code) {
        try {
            // Tạo body cho yêu cầu POST
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("redirect_uri", redirectUri);
            formData.add("code", code);
            formData.add("grant_type", "authorization_code");

            // Tạo header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Tạo request entity
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            // Gửi yêu cầu POST để lấy token
            String response = restTemplate.postForObject("https://accounts.google.com/o/oauth2/token", request, String.class);

            // Parse response để lấy access token
            JsonNode node = mapper.readTree(response).get("access_token");
            if (node == null || node.isNull()) {
                throw new RuntimeException("Không nhận được access_token từ Google.");
            }
            return node.textValue();
        } catch (Exception e) {
            logger.error("Lỗi khi lấy access token từ Google: {}", e.getMessage());
            throw new RuntimeException("Không thể lấy access token từ Google", e);
        }
    }

    public GooglePojo getUserInfo(final String accessToken) {
        if (accessToken == null || accessToken.isEmpty()) {
            throw new RuntimeException("Access token không hợp lệ.");
        }

        try {
            // Tạo header với Bearer token
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            // Tạo request entity
            HttpEntity<String> request = new HttpEntity<>(headers);

            // Gửi yêu cầu GET để lấy thông tin người dùng
            return restTemplate.exchange(userInfoUrl + accessToken, HttpMethod.GET, request, GooglePojo.class).getBody();
        } catch (Exception e) {
            logger.error("Lỗi khi lấy thông tin người dùng từ Google: {}", e.getMessage());
            throw new RuntimeException("Không thể lấy thông tin người dùng từ Google", e);
        }
    }

    public User buildUser(GooglePojo googlePojo) {
        User userDetail = userRepository.findByEmail(googlePojo.getEmail());
        if (userDetail == null) {
            logger.info("Người dùng mới. Đăng ký với email: {}", googlePojo.getEmail());
            return registerNewUser(googlePojo);
        } else {
            logger.info("Người dùng đã tồn tại. Cập nhật thông tin với email: {}", googlePojo.getEmail());
            return updateExistingUser(userDetail, googlePojo);
        }
    }

    private User registerNewUser(GooglePojo googlePojo) {
        User user = new User();
        user.setAuthProvider(AuthProvider.google);
        user.setFullname(googlePojo.getName());
        user.setEmail(googlePojo.getEmail());
        user.setImage_url(googlePojo.getPicture());
        user.setEnable(Enable.ENABLE);
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            logger.error("Lỗi khi lưu người dùng mới: {}", e.getMessage());
            throw new RuntimeException("Không thể đăng ký người dùng mới", e);
        }
    }

    private User updateExistingUser(User existingUser, GooglePojo googlePojo) {
        existingUser.setFullname(googlePojo.getName());
        existingUser.setImage_url(googlePojo.getPicture());
        try {
            return userRepository.save(existingUser);
        } catch (Exception e) {
            logger.error("Lỗi khi cập nhật người dùng: {}", e.getMessage());
            throw new RuntimeException("Không thể cập nhật thông tin người dùng", e);
        }
    }
}
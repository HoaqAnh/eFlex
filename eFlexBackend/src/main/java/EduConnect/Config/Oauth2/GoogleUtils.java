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

import org.springframework.stereotype.Component;

import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.LinkedHashMap;

@Component
public class GoogleUtils {

    private static final Logger logger = LoggerFactory.getLogger(GoogleUtils.class);

    private final WebClient webClient;
    private final UserRepository userRepository;

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

    public GoogleUtils(UserRepository userRepository, WebClient.Builder webClientBuilder) {
        this.userRepository = userRepository;
        this.webClient = webClientBuilder.build();
    }

    public String getToken(final String code) {
        try {
            String response = webClient.post()
                    .uri("https://accounts.google.com/o/oauth2/token")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .body(BodyInserters.fromFormData("client_id", clientId)
                            .with("client_secret", clientSecret)
                            .with("redirect_uri", redirectUri)
                            .with("code", code)
                            .with("grant_type", "authorization_code"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper mapper = new ObjectMapper();
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
            return webClient.get()
                    .uri(userInfoUrl + accessToken)
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(GooglePojo.class)
                    .block();
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


package EduConnect.Config;

import EduConnect.Domain.Response.RestResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();
    private final ObjectMapper mapper;

    public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        this.delegate.commence(request, response, authException);
        response.setContentType("application/json;charset=utf-8");

        RestResponse<Object> restResponse = new RestResponse<>();
        // Lấy thông điệp lỗi
        String errorMessage = Optional.ofNullable(authException.getCause())
                .map(Throwable::getMessage)
                .orElse(authException.getMessage());

        if (errorMessage != null && errorMessage.toLowerCase().contains("expired")) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            restResponse.setStatusCode(HttpStatus.FORBIDDEN.value());
            restResponse.setError("Token đã hết hạn");
            restResponse.setMessage("Vui lòng đăng nhập lại hoặc làm mới token.");
        } else {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            restResponse.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            restResponse.setError(errorMessage);
            restResponse.setMessage("Token không hợp lệ (Không đúng định dạng, không tồn tại, ...)");
        }

        // Ghi response dưới dạng JSON
        mapper.writeValue(response.getWriter(), restResponse);
    }
}
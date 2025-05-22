package EduConnect.Domain.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordRequest {
    private String password;
    private String newPassword;
    private String confirmPassword;
}

package EduConnect.Config.Oauth2.oauth2;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.oauth2.client.registration.ClientRegistration;

@Getter
@Setter
public class GooglePojo {
    private String id;
    private String email;
    private boolean verified_email;
    private String name;
    private ClientRegistration registration;
    private String given_name;
    private String family_name;
    private String link;
    private String picture;
}

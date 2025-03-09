package EduConnect.Controller;

import EduConnect.Domain.Response.UserDTO;
import EduConnect.Domain.User;
import EduConnect.Service.EmailService;
import EduConnect.Service.UserService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Error.IdInValidException;
import EduConnect.Util.SecurityUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static EduConnect.Service.RedisWorker.TaskWorker.QUEUE_REGISTER;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final UserService userService;
    private final SecurityUtil securityUtil;
    private final EmailService emailService;
    private final RedisTemplate<String,String> redisTemplate;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    public AuthController(UserService userService, SecurityUtil securityUtil, EmailService emailService, AuthenticationManagerBuilder authenticationManagerBuilder, RedisTemplate<String, String> redisTemplate) {
        this.userService = userService;
        this.securityUtil = securityUtil;
        this.emailService = emailService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.redisTemplate = redisTemplate;
    }
    @Value("${imthang.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    private static final String QUEUE_REGISTER ="register";

    @PostMapping("/auth/register")
    @ApiMessage("Register Account")
    public ResponseEntity<UserDTO> register(@RequestBody User user) throws IdInValidException {
        if(this.userService.getUserByEmail(user.getEmail())!=null){
            throw new IdInValidException("User has been exists!");
        }
        UserDTO userDTO=this.userService.CreateUser(user);
        this.emailService.sendLinkVerify(user.getEmail(), user.getFullname());
        this.redisTemplate.opsForList().leftPush(QUEUE_REGISTER,user.getEmail());
        return ResponseEntity.ok().body(userDTO);
    }

}

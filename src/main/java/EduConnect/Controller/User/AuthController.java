package EduConnect.Controller.User;

import EduConnect.Domain.Request.ReqDTO;
import EduConnect.Domain.Response.ResLoginDTO;
import EduConnect.Domain.Response.UserDTO;
import EduConnect.Domain.User;
import EduConnect.Service.EmailService;
import EduConnect.Service.RedisService;
import EduConnect.Service.UserService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.Enum.Enable;
import EduConnect.Util.Error.IdInValidException;
import EduConnect.Util.SecurityUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final UserService userService;
    private final SecurityUtil securityUtil;
    private final EmailService emailService;
    private final RedisService redisService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    public AuthController(UserService userService, SecurityUtil securityUtil,
                          EmailService emailService,
                          AuthenticationManagerBuilder authenticationManagerBuilder,
                          RedisService redisService) {
        this.userService = userService;
        this.securityUtil = securityUtil;
        this.emailService = emailService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.redisService = redisService;
    }
    @Value("${imthang.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    @PostMapping("/auth/register")
    @ApiMessage("Register Account")
    public ResponseEntity<UserDTO> register(@RequestBody User user) throws IdInValidException {
        if(this.userService.getUserByEmail(user.getEmail())!=null){
            throw new IdInValidException("User has been exists!");
        }
        UserDTO userDTO=this.userService.CreateUser(user);
//        this.emailService.sendLinkVerify(user.getEmail(), user.getFullname());
        this.redisService.RegisterWorker(user.getEmail());
        return ResponseEntity.ok().body(userDTO);
    }
    @PostMapping("/auth/verify")
    @ApiMessage("Verify Account")
    public ResponseEntity<UserDTO> verify(@RequestParam(name = "token") String token) throws IdInValidException {
        Jwt UserToken=this.securityUtil.checkValidRefreshToken(token);
        String email=UserToken.getSubject();
        User user=this.userService.getUserByEmail(email);
        if(user==null){
            throw new IdInValidException("User hasn't exists!");
        }
        user.setEnable(Enable.ENABLE);
        this.userService.Save(user);
        return ResponseEntity.ok().body(this.userService.UserToDTO(user));
    }
    @PostMapping("/auth/login")
    @ApiMessage("Login Account")
    public ResponseEntity<ResLoginDTO> login(@RequestBody ReqDTO user) throws IdInValidException {
        User currentUserDB=this.userService.getUserByEmail(user.getEmail());
        if(currentUserDB==null)
        {
            throw new IdInValidException("User hasn't exists!");
        }

        UsernamePasswordAuthenticationToken token=new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        //xac thuc
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(token);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO resLoginDTO = new ResLoginDTO();

        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    currentUserDB.getId()
                    , currentUserDB.getEmail()
                    , currentUserDB.getFullname()
                    , currentUserDB.getRole());

            resLoginDTO.setUserLogin(userLogin);
        }

        //create a token => can viet ham loadUserByUsername
        String AccessToken = this.securityUtil.createAcessToken(authentication.getName(), resLoginDTO);

        resLoginDTO.setAccessToken(AccessToken);

        //create refresh token
        String refresh_token = this.securityUtil.createRefreshToken(currentUserDB.getEmail(), resLoginDTO);
        //update user
        this.userService.updateTokensAsync(refresh_token,user.getEmail());
        //set cookies
        ResponseCookie resCookies = ResponseCookie.from("refresh_token1", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().
                header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(resLoginDTO);
    }
    @GetMapping("/auth/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(@CookieValue(name = "refresh_token1", defaultValue = "ABC") String refresh_token)
            throws IdInValidException {
        ResLoginDTO resLoginDTO = new ResLoginDTO();

        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
        String email = decodedToken.getSubject();

        String redisKey = "refreshtoken:" + email;
        String storedRefreshToken = redisService.getRefreshToken(redisKey);
        if (storedRefreshToken == null || !storedRefreshToken.equals(refresh_token)) {
            throw new IdInValidException("Refresh Token không hợp lệ hoặc đã hết hạn");
        }


        User current = this.userService.getUserByEmail(email);
        if (current == null) {
            throw new IdInValidException("Người dùng không tồn tại");
        }
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                current.getId(), current.getEmail(), current.getFullname(), current.getRole());
        resLoginDTO.setUserLogin(userLogin);


        String accessToken = this.securityUtil.createAcessToken(email, resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);

        long ttl = this.redisService.getTTL(redisKey);
        ResponseCookie resCookies = null;
        if (ttl < 300) {
            String newRefreshToken = this.securityUtil.createRefreshToken(email, resLoginDTO);
            this.userService.updateTokensAsync(newRefreshToken, email);

            resCookies = ResponseCookie.from("refresh_token1", newRefreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(refreshTokenExpiration)
                    .build();
        }

        return resCookies != null
                ? ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookies.toString()).body(resLoginDTO)
                : ResponseEntity.ok().body(resLoginDTO);
    }



    @GetMapping("/auth/account")
    @ApiMessage("get Account")
    public ResponseEntity<UserDTO> getAccount() throws IdInValidException {
        UserDTO userDTO=new UserDTO();
        Optional<String> email=SecurityUtil.getCurrentUserLogin();
        if(email.isPresent()){
            User currentUserDB = this.userService.getUserByEmail(email.get());
            if(currentUserDB.getRole()==null){
                userDTO.setRoleName("");
            }else
            {
                userDTO.setRoleName(currentUserDB.getRole().getRoleName());
            }
            userDTO.setAddress(currentUserDB.getAddress());
            userDTO.setEmail(currentUserDB.getEmail());
            userDTO.setFullname(currentUserDB.getFullname());
            userDTO.setId(currentUserDB.getId());
        }
        return ResponseEntity.ok(userDTO);
    }
    @PostMapping("/auth/logout")
    @ApiMessage("Logout User")
    public ResponseEntity<Void> logout()throws IdInValidException{
        String email=SecurityUtil.getCurrentUserLogin().isPresent()?SecurityUtil.getCurrentUserLogin().get():"";
        if(email.equals(""))
        {
            throw new IdInValidException("Access token khong hop le");
        }

        this.userService.updateUserToken(null,email);
        //remove refresh token cookie
        ResponseCookie resCookies=ResponseCookie.from("refresh_token1",null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,resCookies.toString()).body(null);
    }

}

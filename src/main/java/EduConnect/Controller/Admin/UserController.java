package EduConnect.Controller.Admin;


import EduConnect.Domain.Request.PasswordRequest;
import EduConnect.Domain.Response.UserDTO;
import EduConnect.Domain.User;
import EduConnect.Service.UserService;
import EduConnect.Util.Error.IdInValidException;
import EduConnect.Util.SecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@RequestBody User requestUser) {
        return ResponseEntity.ok(userService.CreateUser(requestUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") long id) {
        this.userService.deleteUserById(id);
        return ResponseEntity.ok(null);
    }

    @PutMapping("/users")
    public ResponseEntity<UserDTO> updateUser(@RequestBody User requestUser) {

        this.userService.updateUser(requestUser);
        UserDTO userDTO = userService.UserToDTO(requestUser);
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);

    }
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable("id") long id) {

        User user = this.userService.getUserById(id);
        UserDTO userDTO = userService.UserToDTO(user);
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> userList = this.userService.getAllUser();
        List<UserDTO> userDTOList = new ArrayList<>();
        for (User user : userList) {
            UserDTO userDTO = userService.UserToDTO(user);
            userDTOList.add(userDTO);
        }
        return ResponseEntity.status(HttpStatus.OK).body(userDTOList);
    }

    @PutMapping("/users/updatePassword")
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordRequest requestUser) throws IdInValidException {
        System.out.println(requestUser.getNewPassword());
        System.out.println(requestUser.getConfirmPassword());
        String email = SecurityUtil.getCurrentUserLogin().get();

        User user = this.userService.getUserByEmail(email);
        if (passwordEncoder.matches(requestUser.getPassword(), user.getPassword())) {
            if (requestUser.getNewPassword().equals(requestUser.getConfirmPassword())){
                this.userService.updatePassWord(user, requestUser.getNewPassword());
            }
            else if (requestUser.getNewPassword().equals(requestUser.getPassword())){
                throw new IdInValidException("Please choose a new password different from the old one.");
            }
            else{
                throw new IdInValidException("NewPassword and ConfirmPassword don't match");
            }
        }
        else{
            throw new IdInValidException("Wrong password");
        }
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}

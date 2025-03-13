package EduConnect.Service;

import EduConnect.Domain.Response.UserDTO;
import EduConnect.Domain.Role;
import EduConnect.Domain.User;
import EduConnect.Repository.RoleRepository;
import EduConnect.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final RedisService redisService;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository, RedisService redisService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.redisService = redisService;
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public UserDTO CreateUser(User user) {
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setAddress(user.getAddress());
        userDTO.setFullname(user.getFullname());

        this.userRepository.save(user);
        if(user.getRole()!=null){
            Optional<Role> role=this.roleRepository.findById(user.getRole().getId());
            if(role.isPresent())
            {
                Role role1=role.get();
                userDTO.setRoleName(role1.getRoleName());
            }
        }else{
            userDTO.setRoleName("USER");
        }

        return userDTO;
    }
    public void Save(User user)
    {
        this.userRepository.save(user);
    }
    public UserDTO UserToDTO(User user) {
        UserDTO userDTO=new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullname(user.getFullname());
        userDTO.setAddress(user.getAddress());
        if(user.getRole()!=null){
            userDTO.setRoleName(user.getRole().getRoleName());
        }

        return userDTO;
    }
    @Async
    public CompletableFuture<Void> updateTokensAsync(String refreshToken, String email) {
        updateUserToken(refreshToken, email);
        this.redisService.saveRefreshToken(email, refreshToken, 900000);
        return CompletableFuture.completedFuture(null);
    }
    public void updateUserToken(String refresh_token, String email){
        User user=this.userRepository.findByEmail(email);
        user.setRefreshToken(refresh_token);
        this.userRepository.save(user);
    }
    public User getUserByRefreshTokenAndEmail(String email,String refreshToken)
    {
        return this.userRepository.findByEmailAndRefreshToken(email,refreshToken);
    }
}

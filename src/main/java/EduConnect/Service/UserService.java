package EduConnect.Service;

import EduConnect.Domain.Response.UserDTO;
import EduConnect.Domain.Role;
import EduConnect.Domain.User;
import EduConnect.Repository.RoleRepository;
import EduConnect.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
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
}

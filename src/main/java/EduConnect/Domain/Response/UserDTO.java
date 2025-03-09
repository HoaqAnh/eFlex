package EduConnect.Domain.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private long id;
    private String email;
    private String fullname;
    private String address;
    private String RoleName;

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getRoleName() { return RoleName; }
    public void setRoleName(String roleName) { this.RoleName = roleName; }
}
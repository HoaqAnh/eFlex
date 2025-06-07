package EduConnect.Domain.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
    private String sender;
    private String type;
    private int activeUsers;
    private boolean isAdmin;
    public Message(String sender, String type, int activeUsers,boolean isAdmin) {
        this.sender = sender;
        this.type = type;
        this.activeUsers = activeUsers;
        this.isAdmin = isAdmin;
    }
}

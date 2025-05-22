package EduConnect.Service.WebSocket;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccessCountMessage {
    private int activeUsers;

    public AccessCountMessage(int activeUsers) {
        this.activeUsers = activeUsers;
    }

    public int getActiveUsers() {
        return activeUsers;
    }
}

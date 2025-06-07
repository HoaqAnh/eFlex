package EduConnect.Service.WebSocket;

import EduConnect.Domain.Request.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class AccessCounterService {
    private final SimpMessagingTemplate messagingTemplate;
    private final Set<String> activeUsers = new HashSet<>();

    private final Map<String, Set<String>> userSessions = new HashMap<>();

    public AccessCounterService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void incrementAccessCount(String username, String sessionId) {
        if(userSessions.get(username)==null) {
            userSessions.computeIfAbsent(username, k -> new HashSet<>()).add(sessionId);
            if (activeUsers.add(username)) {
                System.out.println("Incremented active users: " + activeUsers.size());
                broadcastAccessCount(activeUsers.size());
            }
        }
    }

    public void decrementAccessCount(String username, String sessionId) {
        Set<String> sessions = userSessions.get(username);
        if (sessions != null) {
            sessions.remove(sessionId);
            if (sessions.isEmpty()) {
                activeUsers.remove(username);
                userSessions.remove(username);
                System.out.println("Decremented active users: " + activeUsers.size());
                broadcastAccessCount(activeUsers.size());
            }
        }
    }
    private void broadcastAccessCount(int count) {
        messagingTemplate.convertAndSend("/topic/public", new Message("SYSTEM", "UPDATE", count, false) {
        });
    }

    public int getActiveUsers() {
        return activeUsers.size();
    }
}
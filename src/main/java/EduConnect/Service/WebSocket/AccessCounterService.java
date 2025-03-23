package EduConnect.Service.WebSocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AccessCounterService {
    private final SimpMessagingTemplate messagingTemplate;
    private final Set<String> activeSessions = new HashSet<>();

    public AccessCounterService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void incrementAccessCount(String sessionId) {
        activeSessions.add(sessionId);
        System.out.println("Incremented active users: " + activeSessions.size());
        broadcastAccessCount(activeSessions.size());
    }

    public void decrementAccessCount(String sessionId) {
        activeSessions.remove(sessionId);
        int count = activeSessions.size();
        System.out.println("Decremented active users: " + count);
        broadcastAccessCount(count);
    }

    private void broadcastAccessCount(int count) {
        messagingTemplate.convertAndSend("/topic/public", new AccessCountMessage(count));
    }

    public int getActiveUsers() {
        return activeSessions.size();
    }
}
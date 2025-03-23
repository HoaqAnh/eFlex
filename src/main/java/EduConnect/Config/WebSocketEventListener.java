package EduConnect.Config;

import EduConnect.Domain.User;
import EduConnect.Repository.UserRepository;
import EduConnect.Service.WebSocket.AccessCounterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalTime;

@Component
public class WebSocketEventListener {
    private final UserRepository userRepository;
    private final AccessCounterService accessCounterService;
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    public WebSocketEventListener(UserRepository userRepository, AccessCounterService accessCounterService) {
        this.userRepository = userRepository;
        this.accessCounterService = accessCounterService;
    }

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        Boolean isAdmin = (Boolean) headerAccessor.getSessionAttributes().getOrDefault("isAdmin", false);
        String sessionId = event.getSessionId();

        System.out.println("User disconnected: " + sessionId + ", isAdmin: " + isAdmin);
        if (!isAdmin) {
            accessCounterService.decrementAccessCount(sessionId);
        }
    }
}

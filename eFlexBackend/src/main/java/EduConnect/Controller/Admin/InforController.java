package EduConnect.Controller.Admin;

import EduConnect.Domain.Request.Message;
import EduConnect.Service.WebSocket.AccessCounterService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InforController {
    private final AccessCounterService accessCounterService;

    public InforController(AccessCounterService accessCounterService) {
        this.accessCounterService = accessCounterService;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String username = message.getSender();

        headerAccessor.getSessionAttributes().put("username", username);
        headerAccessor.getSessionAttributes().put("isAdmin", message.isAdmin());

        if (!message.isAdmin()) {
            accessCounterService.incrementAccessCount(username, sessionId);
        }
        int activeUsers = accessCounterService.getActiveUsers();
        return new Message(message.getSender(), message.getType(), activeUsers, message.isAdmin());
    }

    @MessageMapping("/chat.disconnectUser")
    @SendTo("/topic/public")
    public Message disconnectUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String username = message.getSender();

        if (!message.isAdmin()) {
            accessCounterService.decrementAccessCount(username, sessionId);
        }
        int activeUsers = accessCounterService.getActiveUsers();
        return new Message(message.getSender(), message.getType(), activeUsers, message.isAdmin());
    }

    @MessageMapping("/chat.getActiveUsers")
    @SendTo("/topic/public")
    public Message getActiveUsers(SimpMessageHeaderAccessor headerAccessor) {
        int activeUsers = accessCounterService.getActiveUsers();
        return new Message("SYSTEM", "ACTIVE", activeUsers, true);
    }
}

package EduConnect.Controller.Admin;

import EduConnect.Domain.Request.Message;
import EduConnect.Service.UserService;
import EduConnect.Service.WebSocket.AccessCounterService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class InforController {
    private final AccessCounterService accessCounterService;
    private final UserService userService;
    public InforController(AccessCounterService accessCounterService, UserService userService) {
        this.accessCounterService = accessCounterService;
        this.userService = userService;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("isAdmin", message.isAdmin());

        if (!message.isAdmin()) {
            accessCounterService.incrementAccessCount(sessionId);
        }
        int activeUsers = accessCounterService.getActiveUsers();
        return new Message(message.getSender(), message.getType(), activeUsers, message.isAdmin());
    }

    @MessageMapping("/chat.disconnectUser")
    @SendTo("/topic/public")
    public Message disconnectUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (!message.isAdmin()) {
            accessCounterService.decrementAccessCount(sessionId);
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
package EduConnect.Controller;

import EduConnect.Domain.Request.ReqChatBot;
import EduConnect.Domain.Response.ChatResponse;
import EduConnect.Domain.User;
import EduConnect.Service.ChatBotService;

import EduConnect.Service.UserService;
import EduConnect.Util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1")
public class ChatBotController {
    private final ChatBotService chatBotService;
    private final UserService userService;
        public ChatBotController(ChatBotService chatBotService,
                                 UserService userService) {
            this.chatBotService = chatBotService;
            this.userService = userService;
        }
    @PostMapping("/chatbot")
    public ResponseEntity<CompletableFuture<ChatResponse>> chatResponse(@RequestBody ReqChatBot reqChatBot, @RequestParam(name = "apiKey") String apiKey){
            if(reqChatBot.getQuestion().isEmpty())
            {
                ChatResponse chatResponse=new ChatResponse(" Gửi vội vậy người đẹp, chưa nhập gì kìa ");

                return ResponseEntity.ok(CompletableFuture.completedFuture(chatResponse));
            }
            Optional<String> email=SecurityUtil.getCurrentUserLogin();
            User user=this.userService.getUserByEmail(email.get());
            return ResponseEntity.ok().body(this.chatBotService.generateAnswer(apiKey,reqChatBot.getQuestion(),user.getFullname(),user.getAge(), reqChatBot.getChatHistory()));
    }
}

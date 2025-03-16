package EduConnect.Domain.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqChatBot {
    @JsonProperty("ChatHistory")
    private List<History> chatHistory;

    @JsonProperty("Question")
    private String question;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class History {
        @JsonProperty("FromUser")
        private boolean fromUser;

        @JsonProperty("message")
        private String message;
    }

}

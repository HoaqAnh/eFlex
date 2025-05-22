package EduConnect.Service;

import EduConnect.Domain.Request.ReqChatBot;
import EduConnect.Domain.Response.ChatResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ChatBotService {

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private static final Logger logger = LoggerFactory.getLogger(ChatBotService.class);
    private final HttpClient httpClient;

    public ChatBotService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public CompletableFuture<ChatResponse> generateAnswer(
            String API_KEY, String prompt, String username, String age, List<ReqChatBot.History> chatHistory) {
        String processedPrompt = prompt != null ? prompt.replace("\n", " ").replace("\r", " ") : "";
        processedPrompt = isCodeSnippet(processedPrompt) ? "Hãy phân tích hoặc giải thích đoạn mã sau: " + processedPrompt : processedPrompt;

        List<String> chatHistoryStrings = new ArrayList<>();
        if (chatHistory != null) {
            chatHistoryStrings = chatHistory.stream()
                    .map(history -> (history.isFromUser() ? "Người dùng" : "eFlex") + ": " + history.getMessage().replace("\n", " ").replace("\r", " "))
                    .collect(Collectors.toList());
        }

        chatHistoryStrings.add("Người dùng: " + processedPrompt);
        String instruction = buildInstruction(username, age, chatHistoryStrings);

        JSONObject payload = new JSONObject();
        JSONArray contents = new JSONArray();
        JSONObject content = new JSONObject();
        JSONArray parts = new JSONArray();
        parts.put(new JSONObject().put("text", instruction));
        content.put("parts", parts);
        contents.put(content);
        payload.put("contents", contents);

        String jsonPayload = payload.toString(2);
        logger.info("Sending JSON Payload: {}", jsonPayload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "?key=" + API_KEY))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    logger.info("API Response Status: {}", response.statusCode());
                    logger.info("API Response Body: {}", response.body());
                    if (response.statusCode() == 200) {
                        String body = response.body();
                        String generatedText = extractTextFromResponse(body);
                        return new ChatResponse(generatedText);
                    } else {
                        return new ChatResponse("Error: Received status " + response.statusCode() + " - " + response.body());
                    }
                })
                .exceptionally(throwable -> {
                    logger.error("Exception occurred: ", throwable);
                    return new ChatResponse("Error: " + throwable.getMessage());
                });
    }

    private boolean isCodeSnippet(String prompt) {
        return prompt != null && (prompt.contains("{") || prompt.contains("}") || prompt.contains("int") || prompt.contains("return"));
    }

    private String buildInstruction(String username, String age, List<String> chatHistory) {
        String chatHistoryText = String.join("\n", chatHistory);
        return String.format(
                "Your name is **eFlex**, you are an AI developed by **eFlex**. " +
                        "Your **sole purpose** is to assist the user in study.\n" +
                        "### **Personalization for User**\n" +
                        "- **Name/Nickname**: %s\n" +
                        "- **Age**: %s\n" +
                        "- **Nationality**: Vietnam\n" +
                        "- **Primary Language**: Vietnamese\n" +
                        "Provide responses in Vietnamese unless asked to use English. Keep it simple, clear, and encouraging.\n" +
                        "If the input contains code, analyze or explain it. If you cannot process it, return 'Tôi không thể xử lý đoạn mã này'.\n" +
                        "### **Chat History**\n" +
                        "%s",
                username, age, chatHistoryText
        );
    }

    private String extractTextFromResponse(String jsonResponse) {
        try {
            JSONObject json = new JSONObject(jsonResponse);
            if (json.has("error")) {
                JSONObject error = json.getJSONObject("error");
                return "Error: " + error.getString("message") + " (Status: " + error.getInt("code") + ")";
            }
            JSONArray candidates = json.getJSONArray("candidates");
            if (candidates.length() == 0) {
                return "No response from API";
            }
            JSONObject firstCandidate = candidates.getJSONObject(0);
            JSONObject content = firstCandidate.getJSONObject("content");
            JSONArray parts = content.getJSONArray("parts");
            if (parts.length() == 0) {
                return "No content in response";
            }
            return parts.getJSONObject(0).getString("text");
        } catch (Exception e) {
            logger.error("Error parsing JSON response: ", e);
            return "Error parsing response: " + e.getMessage();
        }
    }
}
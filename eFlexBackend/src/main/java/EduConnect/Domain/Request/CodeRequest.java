package EduConnect.Domain.Request;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CodeRequest {
    private String language;
    private String code;
}


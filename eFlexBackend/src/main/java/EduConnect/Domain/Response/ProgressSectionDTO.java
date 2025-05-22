package EduConnect.Domain.Response;


import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ProgressSectionDTO {
    private long id;
    private boolean complete;
    private Instant ngayHoanThanh;
    private Long userId;
    private Long sectionId;
}
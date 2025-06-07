package EduConnect.Controller.User;

import EduConnect.Domain.Request.ReqCourse;
import EduConnect.Domain.Response.SubcriberCourseDTO;

import EduConnect.Service.TienDoService;
import EduConnect.Util.ApiMessage;
import EduConnect.Util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class SubcriberCourse {
    private final TienDoService tienDoService;
    public SubcriberCourse(TienDoService tienDoService) {
        this.tienDoService = tienDoService;
    }
    @PostMapping("/subcriber/course")
    @ApiMessage("Subcriber the course")
    public ResponseEntity<SubcriberCourseDTO> subcriberCourse(@RequestBody ReqCourse reqCourse) {
        String email= SecurityUtil.getCurrentUserLogin().get();
        return ResponseEntity.ok(this.tienDoService.subcriberCourse(email,reqCourse.getTenMon()));
    }
}

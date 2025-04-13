package EduConnect.Service;

import EduConnect.Domain.Response.SubcriberCourseDTO;
import EduConnect.Domain.TienDo;
import EduConnect.Repository.TienDoRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TienDoService {
    private TienDoRepository tienDoRepository;
    private UserService userService;
    private CourseService courseService;
    public TienDoService(TienDoRepository tienDoRepository, UserService userService, CourseService courseService) {
        this.tienDoRepository = tienDoRepository;
        this.userService = userService;
        this.courseService = courseService;
    }
    public SubcriberCourseDTO subcriberCourse(String email, String tenMon) {
        return Optional.ofNullable(userService.getUserByEmail(email))
                .flatMap(user -> Optional.ofNullable(courseService.findByTenMon(tenMon))
                        .map(course -> {
                            TienDo tienDo=new TienDo();
                            tienDo.setCourse(course);
                            tienDo.setNguoiDung(user);
                            save(tienDo);
                            return new SubcriberCourseDTO(course.getTenMon(), user.getFullname());
                        }))
                .orElseThrow(() -> new RuntimeException("User or Course not found"));
    }


    public TienDo save(TienDo tienDo) {
        return tienDoRepository.save(tienDo);
    }
    public void delete(TienDo tienDo) {
        tienDoRepository.delete(tienDo);
    }
    public void deleteTienDoByCourseId(long courseId){

    }
}

package EduConnect.Service;

import EduConnect.Domain.Course;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Repository.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository sourceRepository;

    public CourseService(CourseRepository subjectRepository) {
        this.sourceRepository = subjectRepository;
    }
    public Course findByTenMon(String tenMon) {
        return sourceRepository.findByTenMon(tenMon);
    }
    public Course findById(long id) {
        return sourceRepository.findById(id);
    }
    public Course CreateCourse(Course course) {
        return this.sourceRepository.save(course);
    }

    public ResultPaginationDTO GetAllCourses(Pageable page) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        Page<Course> listCourse=this.sourceRepository.findAll(page);

        ResultPaginationDTO.Meta meta=new ResultPaginationDTO.Meta();

        meta.setPage(page.getPageNumber()+1);
        meta.setPageSize(page.getPageSize());

        meta.setPages(listCourse.getTotalPages());
        meta.setTotal(listCourse.getTotalElements());

        result.setMeta(meta);

        result.setResult(listCourse);
        return result;
    }

    public void RemoveCourse(Long id) {
        sourceRepository.deleteById(id);
    }

    public Course GetCourseById(Long id) {
        return this.sourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Course Not Found"));
    }


}

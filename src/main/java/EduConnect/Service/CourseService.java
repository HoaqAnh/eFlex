package EduConnect.Service;


import EduConnect.Domain.Course;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Repository.CourseRepository;
import EduConnect.Repository.TienDoRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class CourseService {

    private final CourseRepository sourceRepository;
    private final TienDoRepository tienDoRepository;

    public CourseService(CourseRepository subjectRepository, TienDoRepository tienDoRepository) {
        this.sourceRepository = subjectRepository;
        this.tienDoRepository = tienDoRepository;
    }
    public Course findByTenMon(String tenMon) {
        return sourceRepository.findByTenMon(tenMon);
    }
    public Course findById(long id) {
        if(sourceRepository.findById(id).isPresent()) {
            return sourceRepository.findById(id).get();
        }
        else {
            return null;
        }
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
    public ResultPaginationDTO GetAllCoursesByCategory(Pageable page,long idCategory) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        Page<Course> listCourse=this.sourceRepository.findAllByCategoryId(page,idCategory);

        ResultPaginationDTO.Meta meta=new ResultPaginationDTO.Meta();

        meta.setPage(page.getPageNumber()+1);
        meta.setPageSize(page.getPageSize());

        meta.setPages(listCourse.getTotalPages());
        meta.setTotal(listCourse.getTotalElements());

        result.setMeta(meta);

        result.setResult(listCourse);
        return result;
    }
    @Transactional
    public void RemoveCourse(Course course) {
        if(this.tienDoRepository.countByCourse(course.getId())>0) {
            this.tienDoRepository.deleteByCourse(course.getId());
        }
        sourceRepository.deleteById(course.getId());
    }

    public Course GetCourseById(Long id) {
        Optional<Course> course = this.sourceRepository.findById(id);
        if(course.isPresent()) {
            return course.get();
        }else
        {
            return null;
        }
    }



}

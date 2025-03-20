package EduConnect.Repository;

import EduConnect.Domain.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> , JpaSpecificationExecutor<Course> {
    Page<Course> findAll(Pageable pageable);
    Course findByTenMon(String tenMon);
    Course findById(long id);
}

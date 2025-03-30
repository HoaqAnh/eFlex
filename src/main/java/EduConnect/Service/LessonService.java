package EduConnect.Service;

import EduConnect.Domain.Course;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Response.LessonDTO;
import EduConnect.Domain.Response.ResultPaginationDTO;
import EduConnect.Repository.CourseRepository;
import EduConnect.Repository.LessonRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LessonService {
    private final CourseRepository courseRepository;
    private LessonRepository lessonRepository;
public LessonService(LessonRepository lessonRepository, CourseRepository courseRepository) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
}
public Lesson createLesson(Lesson lesson) {
    return lessonRepository.save(lesson);
}

    public List<Lesson> importLessons(MultipartFile file, long idCourse) {
        List<Lesson> lessons = new ArrayList<>();
        try {
            // Kiểm tra định dạng file
            System.out.println("File type: " + file.getContentType());
            if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                throw new IllegalArgumentException("File không phải định dạng Excel (.xlsx)");
            }

            InputStream is = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(is);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua dòng tiêu đề

                Lesson lesson = new Lesson();
                lesson.setTenBai(row.getCell(0).getStringCellValue());
                lesson.setViTri((int) row.getCell(1).getNumericCellValue());

                Optional<Course> course = courseRepository.findById(idCourse);
                course.ifPresent(lesson::setCourse);

                lessons.add(lesson);
            }
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lessonRepository.saveAll(lessons);
    }
    public ResultPaginationDTO getAll(Pageable pageable) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        Page<Lesson> listLess=this.lessonRepository.findAll(pageable);

        ResultPaginationDTO.Meta meta=new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber()+1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(listLess.getTotalPages());
        meta.setTotal(listLess.getTotalElements());

        result.setMeta(meta);

        result.setResult(listLess);
        return result;
    }
    public List<LessonDTO> getLessonByCourse(long idCourse) {
        List<Lesson> lessons = this.lessonRepository.findByLessByCourseId(idCourse);

        return lessons.stream()
                .map(lesson -> new LessonDTO(lesson.getId(), lesson.getTenBai(), lesson.getNgayTao(), lesson.getViTri()))
                .toList();
    }

}

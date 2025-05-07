package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Response.ProgressSectionDTO;
import EduConnect.Repository.*;
import EduConnect.Util.SecurityUtil;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ProgressService {
    private final ProgressSectionRepository progressSectionRepository;
    private final SectionRepository sectionRepository;
    private final ProgressLessonRepository progressLessonRepository;
    private final LessonRepository lessonRepository;
    public ProgressService(ProgressSectionRepository progressSectionRepository,
                           ProgressLessonRepository progressLessonRepository, SectionRepository sectionRepository
    , LessonRepository lessonRepository) {
        this.progressSectionRepository = progressSectionRepository;
        this.progressLessonRepository = progressLessonRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
    }
    public Boolean checkProgressSection(Long idNguoiDung,Long idSection){
        return this.progressSectionRepository.existsByUser_IdAndSection_Id(idNguoiDung,idSection);
    }
    public Boolean checkProgressLesson(Long idNguoiDung,Long Lesson){
        return this.progressLessonRepository.existsByUserIdAndLessonId(idNguoiDung,Lesson);
    }
    public ProgressSectionDTO createProgressSection(User currentUser, ProgressSection progressSection) {
        Long sectionId = progressSection.getSection().getId();
        Section section = sectionRepository.findById(sectionId);


        progressSection.setSection(section);
        progressSection.setUser(currentUser);
        progressSection.setComplete(true);

        progressSectionRepository.save(progressSection);

        ProgressSectionDTO progressSectionDTO = new ProgressSectionDTO();
        progressSectionDTO.setId(progressSection.getId());
        progressSectionDTO.setComplete(true);
        progressSectionDTO.setUserId(currentUser.getId());
        progressSectionDTO.setSectionId(section.getId());

        Lesson lesson = section.getLesson();
        if (lesson == null) {
            throw new IllegalStateException("Section with ID " + sectionId + " is not associated with any Lesson");
        }

        long baiHocId = lesson.getId();
        long nguoiDungId = currentUser.getId();

        long totalSections = sectionRepository.countByLessonId(baiHocId);
        System.out.println("totalSections: " + totalSections);
        long completedSections = progressSectionRepository.countByUserIdAndSectionLessonIdAndCompleteTrue(nguoiDungId, baiHocId);
        System.out.println("completedSections: " + completedSections);

        if (totalSections > 0 && totalSections == completedSections) {

            boolean exists = progressLessonRepository.existsByUserIdAndLessonId(nguoiDungId, baiHocId);
            if (!exists) {
                ProgressLesson progressLesson = new ProgressLesson();
                progressLesson.setUser(currentUser);
                progressLesson.setLesson(lesson);
                progressLesson.setComplete(true);

                progressLessonRepository.save(progressLesson);
            }
        }

        return progressSectionDTO;
    }
    public ProgressSection findByUserIdAndSectionID(Long idUser,Long idSection)
    {
        return this.progressSectionRepository.findByUser_IdAndSection_Id(idUser,idSection);
    }
    public ProgressSectionDTO DataToDTO(ProgressSection progressSection) {
        ProgressSectionDTO progressSectionDTO = new ProgressSectionDTO();
        progressSectionDTO.setId(progressSection.getId());
        progressSectionDTO.setComplete(progressSection.isComplete());
        progressSectionDTO.setUserId(progressSection.getUser().getId());
        progressSectionDTO.setSectionId(progressSection.getSection().getId());

        return progressSectionDTO;
    }
    public boolean existsByUser_IdAndSection_Id(long userId, long sectionId) {
        return progressSectionRepository.existsByUser_IdAndSection_Id(userId, sectionId);
    }
}

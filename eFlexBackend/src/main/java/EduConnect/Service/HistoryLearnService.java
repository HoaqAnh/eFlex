package EduConnect.Service;

import EduConnect.Domain.Course;
import EduConnect.Domain.HistoryLearn;
import EduConnect.Domain.User;
import EduConnect.Repository.HistoryLearnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class HistoryLearnService {

    @Autowired
    private HistoryLearnRepository historyLearnRepository;

    public void logLearning(User user, Course course, Integer duration) {
        Optional<HistoryLearn> existingRecord = historyLearnRepository.findByNguoiDung_IdAndCourse_Id(user.getId(), course.getId());

        if (existingRecord.isPresent()) {
            HistoryLearn historyLearn = existingRecord.get();
            historyLearn.setDuration(historyLearn.getDuration() + duration);
            historyLearn.setFrequency(historyLearn.getFrequency() + 1);
            historyLearn.setTimestamp(LocalDateTime.now());
            historyLearnRepository.save(historyLearn);
        } else {
            HistoryLearn historyLearn = new HistoryLearn();
            historyLearn.setNguoiDung(user);
            historyLearn.setCourse(course);
            historyLearn.setDuration(duration);
            historyLearn.setFrequency(1);
            historyLearn.setTimestamp(LocalDateTime.now());
            historyLearnRepository.save(historyLearn);
        }
    }
}
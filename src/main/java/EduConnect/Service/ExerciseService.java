package EduConnect.Service;

import EduConnect.Domain.Course;
import EduConnect.Domain.Exercise;
import EduConnect.Domain.Lesson;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.Response.ScoreRes;
import EduConnect.Repository.ExerciseRepository;
import EduConnect.Repository.LessonRepository;
import EduConnect.Util.Enum.AnswerCorrect;
import EduConnect.Util.Enum.Dificulty;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final LessonRepository lessonRepository;
    public ExerciseService(ExerciseRepository exerciseRepository, LessonRepository lessonRepository) {
        this.exerciseRepository = exerciseRepository;
        this.lessonRepository = lessonRepository;
    }
    public Page<Exercise> findAll(Pageable pageable) {
        return exerciseRepository.findAll(pageable);
    }
    public List<Exercise> excelExercise(MultipartFile file, long idLesson) {
        List<Exercise> exerciseList = new ArrayList<>();
        try {
            System.out.println("File type: " + file.getContentType());
            if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                throw new IllegalArgumentException("File không phải định dạng Excel (.xlsx)");
            }

            InputStream is = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(is);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                Exercise exercise = new Exercise();
                exercise.setCauHoi(row.getCell(0).getStringCellValue());
                exercise.setDapAn1(row.getCell(1).getStringCellValue());
                exercise.setDapAn2(row.getCell(2).getStringCellValue());
                exercise.setDapAn3(row.getCell(3).getStringCellValue());
                exercise.setDapAn4(row.getCell(4).getStringCellValue());
                String correctAnswer = row.getCell(5).getStringCellValue();
                String dificultyAnswer = row.getCell(6).getStringCellValue();
                if (correctAnswer != null && !correctAnswer.isEmpty()) {
                    try {
                        exercise.setDapAnDung(AnswerCorrect.valueOf(correctAnswer.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid Correct Answer value in row " + (row.getRowNum() + 1) + ": " + correctAnswer);
                    }
                }
                if (dificultyAnswer != null && !dificultyAnswer.isEmpty()) {
                        exercise.setDificulty(Dificulty.valueOf(dificultyAnswer.toUpperCase()));
                }
                else {
                    exercise.setDificulty(Dificulty.EASY);
                }
                Optional<Lesson> lesson1 = lessonRepository.findById(idLesson);
                lesson1.ifPresent(exercise::setLesson);

                exerciseList.add(exercise);
            }
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return exerciseRepository.saveAll(exerciseList);
    }


    public long countExerciseByCourse(long idCourse) {
        return this.exerciseRepository.countExerciseByCourseId(idCourse);
    }

    @Transactional
    public Exercise save(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public Optional<Exercise> findById(Long id) {
        return exerciseRepository.findById(id);
    }

    public boolean existsById(Long id) {
        return exerciseRepository.existsById(id);
    }

    @Transactional
    public void deleteById(Long id) {
        exerciseRepository.deleteById(id);
    }

    public List<Exercise> findByLessonId(Long lessonId) {
        return exerciseRepository.findByLessonId(lessonId);
    }

    public Page<Exercise> findByDificulty(Dificulty dificulty, Pageable pageable) {
        return exerciseRepository.findByDificulty(dificulty,pageable);
    }
    public ScoreRes scoreExercises(Long idLesson, List<AnswerRequest> answerRequests) {
        List<Exercise> exercises = exerciseRepository.findByLessonId(idLesson);
        if (exercises.isEmpty()) {
            ScoreRes scoreRes = new ScoreRes();
            scoreRes.setScore(0.0f);
            scoreRes.setMessage("No exercises found for this lesson.");
            scoreRes.setResults(new ArrayList<>());
            return scoreRes;
        }

        if (answerRequests == null || answerRequests.isEmpty()) {
            ScoreRes scoreRes = new ScoreRes();
            scoreRes.setScore(0.0f);
            scoreRes.setMessage("No answers provided.");
            scoreRes.setResults(new ArrayList<>());
            return scoreRes;
        }

        Map<Long, Exercise> exerciseMap = exercises.stream()
                .collect(Collectors.toMap(Exercise::getId, exercise -> exercise));

        int answerCorrect = 0;
        float soNhan = exercises.size() / 10.0f;
        List<ScoreRes.ExerciseResult> results = new ArrayList<>();

        for (AnswerRequest answerRequest : answerRequests) {
            Exercise exercise = exerciseMap.get(answerRequest.getIdExercise());
            ScoreRes.ExerciseResult result = new ScoreRes.ExerciseResult();
            result.setExerciseId(answerRequest.getIdExercise());
            result.setUserAnswer(answerRequest.getAnswer());

            if (exercise == null) {
                result.setCorrect(false);
            } else {
                boolean isCorrect = isCorrectAnswer(exercise, answerRequest.getAnswer());
                result.setCorrect(isCorrect);
                if (isCorrect) {
                    answerCorrect++;
                }
            }
            results.add(result);
        }

        float score = answerCorrect * soNhan;

        ScoreRes scoreRes = new ScoreRes();
        scoreRes.setScore(score);
        scoreRes.setMessage(String.format("You scored %.2f points out of %d exercises.", score, exercises.size()));
        scoreRes.setResults(results);
        return scoreRes;
    }

    private boolean isCorrectAnswer(Exercise exercise, String userAnswer) {
        if (userAnswer == null || !List.of("A", "B", "C", "D").contains(userAnswer.toUpperCase())) {
            return false;
        }
        String correctAnswer = exercise.getDapAnDung().name();
        return correctAnswer.equalsIgnoreCase(userAnswer);
    }
}
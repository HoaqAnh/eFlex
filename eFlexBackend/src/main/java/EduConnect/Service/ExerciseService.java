package EduConnect.Service;

import EduConnect.Domain.*;
import EduConnect.Domain.Request.AnswerRequest;
import EduConnect.Domain.Response.ExerciseResponseDTO;
import EduConnect.Domain.Response.ScoreRes;
import EduConnect.Repository.*;
import EduConnect.Util.Enum.AnswerCorrect;
import EduConnect.Util.Enum.Dificulty;
import EduConnect.Util.Enum.QuestionType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final TestExerciseRepository testExerciseRepository;
    private final ListeningGroupRepository listeningGroupRepository;
    private final ReadingPassageRepository readingPassageRepository;
    private final LessonRepository lessonRepository;
    public ExerciseService(ExerciseRepository exerciseRepository, TestExerciseRepository testExerciseRepository
    , ListeningGroupRepository listeningGroupRepository
    , ReadingPassageRepository readingPassageRepository
    , LessonRepository lessonRepository) {
        this.exerciseRepository = exerciseRepository;
        this.testExerciseRepository = testExerciseRepository;
        this.listeningGroupRepository = listeningGroupRepository;
        this.readingPassageRepository = readingPassageRepository;
        this.lessonRepository = lessonRepository;
    }
    public Page<Exercise> findAll(Pageable pageable) {
        return exerciseRepository.findAll(pageable);
    }
    public Exercise findById(long id) {
        return this.exerciseRepository.findById(id).orElse(null);
    }

    public List<Exercise> excelExercise(MultipartFile file, long idTestExercise,QuestionType questionType) {
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

                Cell questionCell = row.getCell(0);
                if (questionCell == null || questionCell.getCellType() == CellType.BLANK ||
                        (questionCell.getCellType() == CellType.STRING && questionCell.getStringCellValue().trim().isEmpty())) {
                    continue;
                }

                Exercise exercise = new Exercise();
                exercise.setCauHoi(questionCell.getStringCellValue());

                exercise.setDapAn1(getCellStringValue(row.getCell(1)));
                exercise.setDapAn2(getCellStringValue(row.getCell(2)));
                exercise.setDapAn3(getCellStringValue(row.getCell(3)));
                exercise.setDapAn4(getCellStringValue(row.getCell(4)));

                String correctAnswer = getCellStringValue(row.getCell(5));
                if (correctAnswer != null && !correctAnswer.isEmpty()) {
                    try {
                        exercise.setDapAnDung(AnswerCorrect.valueOf(correctAnswer.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid Correct Answer value in row " + (row.getRowNum() + 1) + ": " + correctAnswer);
                    }
                }
                String difficultyAnswer = getCellStringValue(row.getCell(6));
                if (difficultyAnswer != null && !difficultyAnswer.isEmpty()) {
                    exercise.setDificulty(Dificulty.valueOf(difficultyAnswer.toUpperCase()));
                } else {
                    exercise.setDificulty(Dificulty.EASY);
                }

                Optional<TestExercise> lesson1 = testExerciseRepository.findById(idTestExercise);
                lesson1.ifPresent(exercise::setTestExercise);

                Long idBaiHoc;
                idBaiHoc = lesson1.get().getLesson().getId();

                exercise.setQuestionType(questionType);
                exercise.setId_BaiHoc(idBaiHoc);

                exerciseList.add(exercise);
            }
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error processing Excel file: " + e.getMessage());
        }
        return exerciseRepository.saveAll(exerciseList);
    }
    @Transactional
    public List<Exercise> uploadQuestionsForListening(MultipartFile file, Long testId, Long listeningGroupId,QuestionType questionType) {
        List<Exercise> questionList = new ArrayList<>();

        // Kiểm tra file Excel
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Excel file cannot be empty");
        }
        if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            throw new IllegalArgumentException("File must be in Excel format (.xlsx)");
        }

        // Tìm Test và ListeningGroup
        TestExercise test = testExerciseRepository.findById(testId)
                .orElseThrow(() -> new IllegalArgumentException("Test not found with ID: " + testId));
        ListeningGroup listeningGroup = listeningGroupRepository.findById(listeningGroupId)
                .orElseThrow(() -> new IllegalArgumentException("ListeningGroup not found with ID: " + listeningGroupId));

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                // Bỏ qua hàng tiêu đề (hàng đầu tiên)
                if (row.getRowNum() == 0) {
                    continue;
                }

                // Kiểm tra cột câu hỏi (cột 0)
                Cell questionCell = row.getCell(0);
                if (questionCell == null || questionCell.getCellType() == CellType.BLANK ||
                        (questionCell.getCellType() == CellType.STRING && questionCell.getStringCellValue().trim().isEmpty())) {
                    continue; // Bỏ qua hàng nếu câu hỏi trống
                }

                Exercise question = new Exercise();
                question.setCauHoi(questionCell.getStringCellValue());
                question.setQuestionType(questionType);

                // Lấy các đáp án (cột 1-4)
                question.setDapAn1(getCellStringValue(row.getCell(1)));
                question.setDapAn2(getCellStringValue(row.getCell(2)));
                question.setDapAn3(getCellStringValue(row.getCell(3)));
                question.setDapAn4(getCellStringValue(row.getCell(4)));

                // Lấy đáp án đúng (cột 5)
                String correctAnswer = getCellStringValue(row.getCell(5));
                if (correctAnswer == null || correctAnswer.trim().isEmpty()) {
                    throw new IllegalArgumentException("Correct answer is required in row " + (row.getRowNum() + 1));
                }
                try {
                    question.setDapAnDung(AnswerCorrect.valueOf(correctAnswer.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid Correct Answer value in row " + (row.getRowNum() + 1) + ": " + correctAnswer);
                }

                // Lấy độ khó (cột 6)
                String difficultyValue = getCellStringValue(row.getCell(6));
                if (difficultyValue != null && !difficultyValue.isEmpty()) {
                    try {
                        question.setDificulty(Dificulty.valueOf(difficultyValue.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid Difficulty value in row " + (row.getRowNum() + 1) + ": " + difficultyValue);
                    }
                } else {
                    question.setDificulty(Dificulty.EASY);
                }

                question.setId_BaiHoc(test.getLesson().getId());
                question.setTestExercise(test);
                question.setListeningGroup(listeningGroup);

                questionList.add(question);
            }
            return exerciseRepository.saveAll(questionList);

        } catch (IOException e) {
            throw new RuntimeException("Error processing Excel file: " + e.getMessage(), e);
        }
    }
    @Transactional
    public List<Exercise> uploadQuestionsForReading(MultipartFile file, Long testId, Long readingId,QuestionType questionType) {
        List<Exercise> questionList = new ArrayList<>();

        // Kiểm tra file Excel
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Excel file cannot be empty");
        }
        if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            throw new IllegalArgumentException("File must be in Excel format (.xlsx)");
        }

        // Tìm Test và ListeningGroup
        TestExercise test = testExerciseRepository.findById(testId)
                .orElseThrow(() -> new IllegalArgumentException("Test not found with ID: " + testId));
        ReadingPassage readingPassage = readingPassageRepository.findById(readingId)
                .orElseThrow(() -> new IllegalArgumentException("ListeningGroup not found with ID: " + readingId));

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                // Bỏ qua hàng tiêu đề (hàng đầu tiên)
                if (row.getRowNum() == 0) {
                    continue;
                }

                // Kiểm tra cột câu hỏi (cột 0)
                Cell questionCell = row.getCell(0);
                if (questionCell == null || questionCell.getCellType() == CellType.BLANK ||
                        (questionCell.getCellType() == CellType.STRING && questionCell.getStringCellValue().trim().isEmpty())) {
                    continue; // Bỏ qua hàng nếu câu hỏi trống
                }

                Exercise question = new Exercise();
                question.setCauHoi(questionCell.getStringCellValue());
                question.setQuestionType(questionType);

                // Lấy các đáp án (cột 1-4)
                question.setDapAn1(getCellStringValue(row.getCell(1)));
                question.setDapAn2(getCellStringValue(row.getCell(2)));
                question.setDapAn3(getCellStringValue(row.getCell(3)));
                question.setDapAn4(getCellStringValue(row.getCell(4)));

                // Lấy đáp án đúng (cột 5)
                String correctAnswer = getCellStringValue(row.getCell(5));
                if (correctAnswer == null || correctAnswer.trim().isEmpty()) {
                    throw new IllegalArgumentException("Correct answer is required in row " + (row.getRowNum() + 1));
                }
                try {
                    question.setDapAnDung(AnswerCorrect.valueOf(correctAnswer.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid Correct Answer value in row " + (row.getRowNum() + 1) + ": " + correctAnswer);
                }

                // Lấy độ khó (cột 6)
                String difficultyValue = getCellStringValue(row.getCell(6));
                if (difficultyValue != null && !difficultyValue.isEmpty()) {
                    try {
                        question.setDificulty(Dificulty.valueOf(difficultyValue.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid Difficulty value in row " + (row.getRowNum() + 1) + ": " + difficultyValue);
                    }
                } else {
                    question.setDificulty(Dificulty.EASY);
                }

                question.setId_BaiHoc(test.getLesson().getId());
                question.setTestExercise(test);
                question.setReadingPassage(readingPassage);

                questionList.add(question);
            }
            return exerciseRepository.saveAll(questionList);

        } catch (IOException e) {
            throw new RuntimeException("Error processing Excel file: " + e.getMessage(), e);
        }
    }
    private String getCellStringValue(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        }
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue().trim();
        }
        return String.valueOf(cell);
    }


    public long countExerciseByCourse(long idCourse) {
        return this.exerciseRepository.countExerciseByCourseId(idCourse);
    }

    public TestExercise findByTestExerciseId(long exerciseId){
        return this.exerciseRepository.findExerciseById(exerciseId);
    }

    @Transactional
    public Exercise save(Exercise exercise) {
        if(exercise.getListeningGroup()!=null)
        {
            exercise.setQuestionType(QuestionType.LISTENING);
        }
        else if(exercise.getReadingPassage()!=null)
        {
            exercise.setQuestionType(QuestionType.READ);
        }
        else {
            exercise.setQuestionType(QuestionType.MultipleChoice);
        }

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

    public List<Exercise> findByTestExerciseId(Long testExerciseId) {
        return exerciseRepository.findByTestExerciseId(testExerciseId);
    }

    public ExerciseResponseDTO getGroupedExercisesForTestExercise(Long testExerciseId) {

        TestExercise testExercise = testExerciseRepository.findById(testExerciseId)
                .orElseThrow(() -> {
                    return new RuntimeException("TestExercise not found");
                });
        Lesson currentLesson = testExercise.getLesson();
        if (currentLesson == null) {
            throw new RuntimeException("Lesson not found for TestExercise");
        }

        int currentPosition = currentLesson.getViTri();
        Long courseId = currentLesson.getCourse().getId();

        List<Exercise> exercises = new ArrayList<>();
        exercises.addAll(exerciseRepository.RandomExercisesByTestExerciseIds(testExerciseId,40));

        if (currentPosition > 0) {
            List<Lesson> previousLessons = lessonRepository.findByCourseIdAndViTriLessThan(courseId, currentPosition);
            List<Long> previousTestExerciseIds = previousLessons.stream()
                    .flatMap(lesson -> lesson.getTestExercise().stream())
                    .map(TestExercise::getId)
                    .collect(Collectors.toList());

            if (!previousTestExerciseIds.isEmpty()) {
                for(Long exerciseId : previousTestExerciseIds) {
                    List<Exercise> previousExercises = exerciseRepository.RandomExercisesByTestExerciseIds(
                            exerciseId, 3);
                    exercises.addAll(previousExercises);
                }
            }
        }

        Map<String, ExerciseResponseDTO.ExerciseGroupDTO> groupedExercises = new HashMap<>();
        for (Exercise exercise : exercises) {
            String questionType = exercise.getQuestionType() != null ? exercise.getQuestionType().toString() : "Unknown";
            String groupKey;

            if ("LISTENING".equals(questionType) && exercise.getListeningGroup() != null) {
                groupKey = "LISTENING_" + exercise.getListeningGroup().getId();
            } else if ("READ".equals(questionType) && exercise.getReadingPassage() != null) {
                groupKey = "READ_" + exercise.getReadingPassage().getId();
            } else {
                groupKey = questionType;
            }

            ExerciseResponseDTO.ExerciseDTO exerciseDTO = new ExerciseResponseDTO.ExerciseDTO();
            exerciseDTO.setId(exercise.getId());
            exerciseDTO.setCauHoi(exercise.getCauHoi());
            exerciseDTO.setDapAn1(exercise.getDapAn1());
            exerciseDTO.setDapAn2(exercise.getDapAn2());
            exerciseDTO.setDapAn3(exercise.getDapAn3());
            exerciseDTO.setDapAn4(exercise.getDapAn4());
            exerciseDTO.setDapAnDung(exercise.getDapAnDung() != null ? exercise.getDapAnDung().toString() : null);
            exerciseDTO.setDificulty(exercise.getDificulty() != null ? exercise.getDificulty().toString() : null);
            exerciseDTO.setQuestionType(questionType);

            ExerciseResponseDTO.ExerciseGroupDTO group = groupedExercises.computeIfAbsent(groupKey, k -> new ExerciseResponseDTO.ExerciseGroupDTO());
            group.getExercises().add(exerciseDTO);

            if ("LISTENING".equals(questionType) && exercise.getListeningGroup() != null) {
                group.setNameGroup(exercise.getListeningGroup().getGroupName());
                group.setAudioFile(exercise.getListeningGroup().getAudioFile());
            } else if ("READ".equals(questionType) && exercise.getReadingPassage() != null) {
                group.setNameGroup(exercise.getReadingPassage().getContent());
                group.setPassageId(exercise.getReadingPassage().getId());
                group.setTitle(exercise.getReadingPassage().getTitle());
            }
        }

        ExerciseResponseDTO responseDTO = new ExerciseResponseDTO();
        responseDTO.setData(groupedExercises);
        return responseDTO;
    }

    public Page<Exercise> findByDificulty(Dificulty dificulty, Pageable pageable) {
        return exerciseRepository.findByDificulty(dificulty,pageable);
    }

    public ScoreRes scoreExercises(Long testExerciseId, List<AnswerRequest> answerRequests) {
        List<Exercise> exercises = exerciseRepository.findByTestExerciseId(testExerciseId);
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

    public List<Exercise> findExerciseListRandomByLessonId(long idLesson, int randomNumber) {
        List<Exercise> exerciseList = exerciseRepository.findAllByLessonId(idLesson);
        Collections.shuffle(exerciseList);

        if (exerciseList.size() >= randomNumber) {
            return new ArrayList<>(exerciseList.subList(0, randomNumber));
        } else {
            return new ArrayList<>(exerciseList);
        }
    }

    public List<Exercise> findByReadingPassage(long idReadingPassage){
        return this.exerciseRepository.findByReadingPassageId(idReadingPassage);
    }

    public List<Exercise> findByReadingPassageIdEachTestExercise(long idReadingPassage, long testExercise){
        return this.exerciseRepository.findByReadingPassageIdEachTestExercise(idReadingPassage,testExercise);
    }
}
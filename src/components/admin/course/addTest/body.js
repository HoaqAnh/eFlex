import "../../../../styles/admin/addTest/body.css";
import MultipleChoiceTest from "./MultipleChoiceTest";
import ListeningTest from "./ListeningTest";
import ReadingTest from "./ReadingTest";

const Body = ({
    testData, testErrors, handleTestInputChange,
    selectedTestTypes, handleTestTypeChange,

    // Multiple Choice Props
    mcData, mcErrors, handleMCFileChange,

    // Listening Props
    listeningData, listeningErrors, audioFile, excelFileListening,
    handleListeningInputChange, handleListeningAudioFileChange, handleListeningExcelFileChange,

    // Reading Props
    readingData, readingErrors, excelFileReading,
    handleReadingInputChange, handleReadingExcelFileChange,
}) => (
    <form className="addTest-body" onSubmit={(e) => e.preventDefault()}> {/* Ngăn submit mặc định của form */}
        <div className="addTest-body__form-group">
            <div className="addTest-body__form-subgroup">
                <label className="addTest-body__label" htmlFor="testName">Tên bài kiểm tra *</label>
                <input
                    id="testName"
                    type="text"
                    className={`addTest-body__input ${testErrors.name ? 'input-error' : ''}`}
                    placeholder="Nhập tên bài kiểm tra"
                    value={testData.name}
                    onChange={(e) => handleTestInputChange('name', e.target.value)}
                />
                {testErrors.name && <p className="addTest-body__error-message">{testErrors.name}</p>}
            </div>
            <div className="addTest-body__form-subgroup">
                <label className="addTest-body__label" htmlFor="testDuration">Thời gian làm bài (phút) *</label>
                <input
                    id="testDuration"
                    type="number"
                    className={`addTest-body__input ${testErrors.duration ? 'input-error' : ''}`}
                    placeholder="Nhập thời gian làm bài"
                    value={testData.duration === 0 ? '' : testData.duration} // Hiển thị rỗng nếu là 0
                    onChange={(e) => handleTestInputChange('duration', e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                    min="1"
                />
                {testErrors.duration && <p className="addTest-body__error-message">{testErrors.duration}</p>}
            </div>
        </div>

        <div className="addTest-body__form-group">
            <div className="addExercise-body__form-group">
                <div className="addExercise-body__form-group-label">
                    <label className="addExercise-body__label">Chọn các thể loại câu hỏi cho bài kiểm tra:</label>
                </div>
                <div className="addExercise-body__form-group-actions">
                    <div
                        className={`addExercise-body__option ${selectedTestTypes.multipleChoice ? 'option-enabled' : 'option-disabled'}`}
                        onClick={() => handleTestTypeChange('multipleChoice')}
                        tabIndex={0} // Cho phép focus
                        onKeyPress={(e) => e.key === 'Enter' && handleTestTypeChange('multipleChoice')} // Cho phép chọn bằng Enter
                        role="button" // Vai trò
                    >
                        <p>Trắc nghiệm (Multiple Choice)</p>
                    </div>
                    <div
                        className={`addExercise-body__option ${selectedTestTypes.listening ? 'option-enabled' : 'option-disabled'}`}
                        onClick={() => handleTestTypeChange('listening')}
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleTestTypeChange('listening')}
                        role="button"
                    >
                        <p>Nghe (Listening)</p>
                    </div>
                    <div
                        className={`addExercise-body__option ${selectedTestTypes.reading ? 'option-enabled' : 'option-disabled'}`}
                        onClick={() => handleTestTypeChange('reading')}
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleTestTypeChange('reading')}
                        role="button"
                    >
                        <p>Đọc hiểu (Reading)</p>
                    </div>
                    {/* Speaking có thể thêm tương tự nếu cần */}
                </div>
            </div>
        </div>

        {/* Hiển thị form tương ứng với lựa chọn */}
        {selectedTestTypes.multipleChoice && (
            <fieldset className="addTest-body__fieldset">
                <legend className="addTest-body__legend">Phần Trắc Nghiệm</legend>
                <MultipleChoiceTest
                    excelFile={mcData.excelFile}
                    handleFileChange={handleMCFileChange}
                    testErrors={mcErrors}
                />
            </fieldset>
        )}
        {selectedTestTypes.listening && (
            <fieldset className="addTest-body__fieldset">
                <legend className="addTest-body__legend">Phần Nghe</legend>
                <ListeningTest
                    testData={listeningData}
                    testErrors={listeningErrors}
                    audioFile={audioFile}
                    excelFile={excelFileListening}
                    handleInputChange={handleListeningInputChange}
                    handleAudioFileChange={handleListeningAudioFileChange}
                    handleExcelFileChange={handleListeningExcelFileChange}
                />
            </fieldset>
        )}
        {selectedTestTypes.reading && (
            <fieldset className="addTest-body__fieldset">
                <legend className="addTest-body__legend">Phần Đọc Hiểu</legend>
                <ReadingTest
                    testData={readingData}
                    testErrors={readingErrors}
                    excelFile={excelFileReading}
                    handleInputChange={handleReadingInputChange}
                    handleExcelFileChange={handleReadingExcelFileChange}
                />
            </fieldset>
        )}
    </form>
);

export default Body;
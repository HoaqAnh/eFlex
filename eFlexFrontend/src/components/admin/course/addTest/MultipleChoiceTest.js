const MultipleChoiceTest = ({ excelFile, handleFileChange, testErrors }) => (
    <div className="addExercise-body__form-group">
        <div className="addExercise-upload-file">
            <label className="addExercise-body__create-question-label" htmlFor="excel-file-multiple">
                Tải lên file Excel câu hỏi trắc nghiệm *
            </label>
            <input
                type="file"
                id="excel-file-multiple"
                className="addExercise-body__input-file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
            />
            <label
                htmlFor="excel-file-multiple"
                className="addExercise-body__input-file-label"
            >
                {excelFile ? "Thay đổi file Excel" : "Chọn file Excel"}
            </label>
            <div className="addExercise-body__input-file-name">
                {excelFile ? excelFile.name : "Chưa chọn file"}
            </div>
            {testErrors && testErrors.excelFile && <p className="addTest-body__error-message">{testErrors.excelFile}</p>}
        </div>

        <div className="addExercise-create-question">
            <label className="addExercise-body__create-question-label">
                Hướng dẫn định dạng file Excel
            </label>
            <div className="addExercise-body__create-question">
                <p>File Excel cần có các cột tương tự như phần trắc nghiệm (Question Text, Option A, Option B, Option C, Option D, Correct Answer, Dificulty Answer).</p>
            </div>
        </div>
    </div>
);

export default MultipleChoiceTest;
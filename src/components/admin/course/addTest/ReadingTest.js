const ReadingTest = ({
    testData, testErrors, excelFile,
    handleInputChange, handleExcelFileChange
}) => (
    <div className="addExercise-body__form-group">
        <div className="addExercise-upload-file">
            <label className="addExercise-body__create-question-label" htmlFor="readingPassageTitle">
                Tiêu đề đoạn văn *
            </label>
            <input
                id="readingPassageTitle"
                type="text"
                className={`addTest-body__input ${testErrors && testErrors.title ? 'input-error' : ''}`}
                placeholder="Nhập tiêu đề cho đoạn văn đọc hiểu"
                value={testData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
            />
            {testErrors && testErrors.title && <p className="addTest-body__error-message">{testErrors.title}</p>}

            <label className="addExercise-body__create-question-label" htmlFor="readingPassageContent">
                Nội dung đoạn văn đọc hiểu *
            </label>
            <textarea
                id="readingPassageContent"
                className={`addTest-body__input addTest-body__textarea ${testErrors && testErrors.readingPassage ? 'input-error' : ''}`}
                placeholder="Nhập hoặc dán nội dung đoạn văn đọc hiểu vào đây..."
                value={testData.readingPassage || ''}
                rows="8"
                style={{ resize: 'vertical', minHeight: '150px' }}
                onChange={(e) => handleInputChange('readingPassage', e.target.value)}
            />
            {testErrors && testErrors.readingPassage && <p className="addTest-body__error-message">{testErrors.readingPassage}</p>}
        </div>

        <div className="addExercise-upload-file">
            <label className="addExercise-body__create-question-label" htmlFor="excel-file-reading">
                Tải lên file Excel câu hỏi đọc hiểu *
            </label>
            <input
                type="file"
                id="excel-file-reading"
                className="addExercise-body__input-file"
                accept=".xlsx,.xls"
                onChange={handleExcelFileChange}
            />
            <label
                htmlFor="excel-file-reading"
                className="addExercise-body__input-file-label"
            >
                {excelFile ? "Thay đổi file Excel" : "Chọn file Excel"}
            </label>
            <div className="addExercise-body__input-file-name">
                {excelFile ? excelFile.name : "Chưa chọn file Excel câu hỏi"}
            </div>
            {testErrors && testErrors.excelFile && <p className="addTest-body__error-message">{testErrors.excelFile}</p>}
        </div>
        <div className="addExercise-create-question">
            <label className="addExercise-body__create-question-label">
                Hướng dẫn định dạng file Excel cho câu hỏi đọc hiểu
            </label>
            <div className="addExercise-body__create-question">
                <p>File Excel cần có các cột tương tự như phần trắc nghiệm (Question Text, Option A, Option B, Option C, Option D, Correct Answer, Dificulty Answer).</p>
            </div>
        </div>
    </div>
);

export default ReadingTest;
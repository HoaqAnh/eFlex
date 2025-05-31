const ListeningTest = ({
    testData, testErrors, audioFile, excelFile,
    handleInputChange, handleAudioFileChange, handleExcelFileChange
}) => (
    <div className="addExercise-body__form-group">
        <div className="addExercise-upload-file">
            <label className="addExercise-body__create-question-label" htmlFor="listeningGroupName">
                Tên bài kiểm tra nghe *
            </label>
            <input
                id="listeningGroupName"
                type="text"
                className={`addTest-body__input ${testErrors && testErrors.groupName ? 'input-error' : ''}`}
                placeholder="Nhập tên bài kiểm tra nghe (ví dụ: Unit 1 Listening Practice)"
                value={testData.groupName || ''}
                onChange={(e) => handleInputChange('groupName', e.target.value)}
            />
            {testErrors && testErrors.groupName && <p className="addTest-body__error-message">{testErrors.groupName}</p>}

            <label className="addExercise-body__create-question-label" htmlFor="audio-file">
                Tải lên file Audio *
            </label>
            <input
                type="file"
                id="audio-file"
                className="addExercise-body__input-file"
                accept=".mp3,.wav,.m4a"
                onChange={handleAudioFileChange}
            />
            <label
                htmlFor="audio-file"
                className="addExercise-body__input-file-label"
            >
                {audioFile ? "Thay đổi file Audio" : "Chọn file Audio (.mp3, .wav, .m4a)"}
            </label>
            <div className="addExercise-body__input-file-name">
                {audioFile ? audioFile.name : "Chưa chọn file audio"}
            </div>
            {testErrors && testErrors.audioFile && <p className="addTest-body__error-message">{testErrors.audioFile}</p>}
        </div>

        <div className="addExercise-upload-file">
            <label className="addExercise-body__create-question-label" htmlFor="excel-file-listening">
                Tải lên file Excel câu hỏi nghe *
            </label>
            <input
                type="file"
                id="excel-file-listening"
                className="addExercise-body__input-file"
                accept=".xlsx,.xls"
                onChange={handleExcelFileChange}
            />
            <label
                htmlFor="excel-file-listening"
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
                Hướng dẫn định dạng file Excel cho câu hỏi nghe
            </label>
            <div className="addExercise-body__create-question">
                <p>File Excel cần có các cột tương tự như phần trắc nghiệm (Question Text, Option A, Option B, Option C, Option D, Correct Answer, Dificulty Answer).</p>
            </div>
        </div>
    </div>
);

export default ListeningTest;
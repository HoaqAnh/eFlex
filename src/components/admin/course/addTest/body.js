import React from "react";
import "../../../../styles/admin/addTest/body.css";

const Body = ({ testData, testErrors, excelFile,
    handleTestInputChange, handleFileChange
}) => (
    <div className="addTest-body">
        <div className="addTest-body__form-group">
            <div className="addTest-body__form-subgroup">
                <label className="addTest-body__label">Tên bài kiểm tra *</label>
                <input
                    type="text"
                    className={`addTest-body__input ${testErrors.name ? 'input-error' : ''}`}
                    placeholder="Nhập tên bài kiểm tra"
                    value={testData.name}
                    onChange={(e) => handleTestInputChange('name', e.target.value)} />
            </div>
            <div className="addTest-body__form-subgroup">
                <label className="addTest-body__label">Thời gian làm bài *</label>
                <input
                    type="text"
                    className={`addTest-body__input ${testErrors.duration ? 'input-error' : ''}`}
                    placeholder="Nhập thời gian làm bài"
                    value={testData.duration}
                    onChange={(e) => handleTestInputChange('duration', e.target.value)} />
            </div>
        </div>

        <div className="addTest-body__form-group">
            <div className="addExercise-body__form-group">
                <div className="addExercise-body__form-group-label">
                    <label className="addExercise-body__label">Thể loại câu hỏi</label>
                </div>
                <div className="addExercise-body__form-group-actions">
                    <div className="addExercise-body__option:enabled option-multiplechoice">
                        <p>Trắc nghiệm</p>
                    </div>
                    <div className="addExercise-body__option:disabled option-essay">
                        <p>Tự luận</p>
                    </div>
                    <div className="addExercise-body__option:disabled option-fillintheblank">
                        <p>Điền vào chỗ trống</p>
                    </div>
                    <div className="addExercise-body__option:disabled option-pairing">
                        <p>Ghép đôi</p>
                    </div>
                </div>
            </div>

            <div className="addExercise-body__form-group">
                <div className="addExercise-upload-file">
                    <input type="file" id="exerciseFile" className="addExercise-body__input-file" onChange={handleFileChange} />
                    <img src="https://cf.quizizz.com/CreateWithAIV2/Source%20abstractions-min.png" alt="UploadFile" loading="lazy" />
                    <label htmlFor="exerciseFile" className="addExercise-body__input-file-label">Tải lên tệp câu hỏi</label>
                    <div className={`addExercise-body__input-file-name ${testErrors.excelFile ? 'input-error' : ''}`}>
                        {excelFile ? excelFile.name : "Chưa có tệp nào được chọn"}
                    </div>
                </div>
                <div className="addExercise-create-question">
                    <img src="https://cf.quizizz.com/CreateWithAIV2/Source%20abstractions-2-min.png" alt="CreateExercises" loading="lazy" />
                    <label className="addExercise-body__create-question-label">Tạo câu hỏi thủ công</label>
                    <div className="addExercise-body__create-question">
                        <p>Chưa có</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Body;
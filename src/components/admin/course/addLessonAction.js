import React, { useRef, useState } from 'react';

const LessonActions = ({ handleBack, handleAddAndContinue, handleSubmit, handleUploadTest, handleAddSection }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const result = await handleUploadTest(file);
            if (result.success) {
                setFileName(file.name);
            }
        }
    };

    const handleRemoveFile = () => {
        setFileName(null);
        fileInputRef.current.value = '';
    };

    return (
        <div className="footer-content">
            <button className="btn btn-return" onClick={handleBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M321.94 98L158.82 237.78a24 24 0 0 0 0 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18" />
                </svg>
                <p>Trở về</p>
            </button>
            <button className="btn btn-secondary" onClick={handleAddSection}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z" />
                </svg>
                Thêm phần học
            </button>

            <button className="btn btn-secondary" onClick={handleAddAndContinue}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z" />
                </svg>
                Thêm bài học
            </button>

            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                />
                {fileName ? (
                    <button 
                        className="btn btn-success" 
                        onClick={handleRemoveFile}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z" />
                        </svg>
                        {fileName}
                    </button>
                ) : (
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => fileInputRef.current.click()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20zm5-12.15L9.125 9.725q-.3.3-.712.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L13 7.85V15q0 .425-.288.713T12 16t-.712-.288T11 15z" />
                        </svg>
                        Tải lên bài kiểm tra
                    </button>
                )}
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}>
                Hoàn thành
            </button>
        </div>
    );
};

export default LessonActions;
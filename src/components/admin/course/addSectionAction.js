import React from 'react';

const SectionActions = ({
    handleUploadVideo,
    handleRemoveSection,
    isFirstSection = false
}) => {
    // Loại bỏ state showRemoveButton vì không cần thiết
    
    return (
        <div className="add-section__actions">
            {!isFirstSection && (
                <button
                    type="button"
                    className="btn btn-section-danger"
                    onClick={handleRemoveSection} // Không cần hàm trung gian nữa
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" />
                    </svg>
                    Xóa phần học
                </button>
            )}
            <button
                type="button"
                className="btn btn-section-secondary"
                onClick={handleUploadVideo}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11.5 15.577v-8.65l-2.33 2.33l-.708-.718L12 5l3.539 3.539l-.708.719L12.5 6.927v8.65zM6.616 19q-.691 0-1.153-.462T5 17.384v-2.423h1v2.423q0 .231.192.424t.423.192h10.77q.23 0 .423-.192t.192-.424v-2.423h1v2.423q0 .691-.462 1.153T17.384 19z" />
                </svg>
                Tải lên video
            </button>
        </div>
    );
};

export default SectionActions;
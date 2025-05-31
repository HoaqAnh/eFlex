import React from 'react';
import "../../../styles/admin/course/footer.css";

const Footer = ({
    isSelectingCourse,
    onToggleSelectCourse,
    onUnselectCourse,
    onToggleHideUnselected,
    courseId,
    hideUnselected,
    handleAddCourse,
    handlEditCourse,
    onDeleteClick
}) => {
    return (
        <div className='course-footer'>
            {!courseId && (
                <>
                    <button
                        className="btn btn-primary"
                        onClick={handleAddCourse}
                    >
                        Thêm khóa học
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onToggleSelectCourse}
                    >
                        {isSelectingCourse ? 'Hủy chọn' : 'Chỉnh sửa khóa học'}
                    </button>
                </>
            )}
            {courseId && (
                <>
                    <button
                        className="btn btn-primary"
                        onClick={onUnselectCourse}
                    >
                        Thoát
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onToggleHideUnselected}
                    >
                        {hideUnselected ? 'Hiện tất cả khóa học' : 'Ẩn khóa học chưa chọn'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handlEditCourse}
                    >
                        Chỉnh sửa thêm
                    </button>
                    <button
                        className="btn btn-secondary"
                    >
                        Bật/tắt khóa học
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={onDeleteClick}
                    >
                        Xóa khóa học
                    </button>
                </>
            )}
        </div>
    );
};

export default Footer;
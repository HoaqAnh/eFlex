import "../../../../styles/admin/addTest/footer.css";

const Footer = ({ handleCancel, handleSubmitAndCreateTest, handleSubmitAndCreateLesson, onSubmit }) => {
    return (
        <div className="addTest-footer">
            <button className="btn btn-danger" onClick={handleCancel}>
                <p>Hủy bỏ tạo bài kiểm tra</p>
            </button>
            <button className="btn btn-secondary" onClick={handleSubmitAndCreateTest}>
                <p>Lưu và tạo bài kiểm tra mới</p>
            </button>
            <button className="btn btn-secondary" onClick={handleSubmitAndCreateLesson}>
                <p>Lưu và tạo bài học mới</p>
            </button>
            <button className="btn btn-primary" onClick={onSubmit}>
                <p>Hoàn thành</p>
            </button>

        </div>
    )
}

export default Footer;
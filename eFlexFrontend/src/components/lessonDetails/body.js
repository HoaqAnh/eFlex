import "../../styles/lessonDetails/body.css";

const Body = ({ selectedSection }) => {
    if (!selectedSection) {
        return (
            <div className="lesson-details__body">
                <div className="lesson-details__body-content">
                    <div className="lesson-details__body-content_header">
                        <h2>Chọn một phần học để bắt đầu</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lesson-details__body">
            <div className="lesson-details__body-content_header">
                <h2>{selectedSection?.tenBai}</h2>
            </div>
            <div className="lesson-details__body-content_main">
                <div className="lesson-details__body-content_body">
                    <p>{selectedSection?.moTa}</p>
                </div>
                {selectedSection?.video && (
                    <div className="lesson-details__body-content_footer">
                        <video src={selectedSection.video} controls />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Body;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//services
import { getLessonSections } from '../../services/lessonService';

//styles
import "../../styles/lessonDetails/body.css"

const Body = ({ selectedSection }) => {
    const { lessonId } = useParams();
    const [sectionDetails, setSectionDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSectionDetails = async () => {
            if (!selectedSection) return;

            try {
                setLoading(true);
                const sectionsData = await getLessonSections(lessonId);
                const section = sectionsData.find(s => s.id === selectedSection.id);
                setSectionDetails(section);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSectionDetails();
    }, [lessonId, selectedSection]);

    if (!selectedSection) {
        return (
            <div className="lesson-details__body">
                <div className="lesson-details__body-content">
                    <div className="lesson-details__body-content-header">
                        <h2>Chọn một phần học để bắt đầu</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="lesson-details__body">Đang tải...</div>;
    }

    if (error) {
        return <div className="lesson-details__body">Có lỗi xảy ra: {error}</div>;
    }

    return (
        <div className="lesson-details__body">
            <div className="lesson-details__body-content">
                <div className="lesson-details__body-content-header">
                    <h2>{sectionDetails?.tenBai}</h2>
                </div>
                <div className="lesson-details__body-content-body">
                    <p>{sectionDetails?.moTa}</p>
                </div>
                <div className="lesson-details__body-content-footer">
                    {sectionDetails?.video && (
                        <video src={sectionDetails.video} controls />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Body;

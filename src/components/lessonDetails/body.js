import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonSections } from '../../services/lessonService';
import "../../styles/lessonDetails/body.css";

const Body = ({ selectedSection, sections }) => {
    const { lessonId } = useParams();
    const [sectionDetails, setSectionDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSectionDetails = async () => {
            if (!selectedSection) return;

            try {
                setLoading(true);
                setError(null);

                if (selectedSection.moTa && selectedSection.video) {
                    setSectionDetails(selectedSection);
                    setLoading(false);
                    return;
                }

                const sectionsData = await getLessonSections(lessonId);
                const section = sectionsData.find(s => s.id === selectedSection.id);
                setSectionDetails(section);
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchSectionDetails();
    }, [lessonId, selectedSection]);

    if (loading) {
        return <div className="lesson-details__body loading">Loading...</div>;
    }

    if (error) {
        return <div className="lesson-details__body error">Có lỗi xảy ra: {error}</div>;
    }

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
            <div className="lesson-details__body-content">
                <div className="lesson-details__body-content_header">
                    <h2>{sectionDetails?.tenBai}</h2>
                </div>
                <div className="lesson-details__body-content_main">
                    <div className="lesson-details__body-content_body">
                        <p>{sectionDetails?.moTa}</p>
                    </div>
                    {sectionDetails?.video && (
                        <div className="lesson-details__body-content_footer">
                            <video src={sectionDetails.video} controls />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Body;
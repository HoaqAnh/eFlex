import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAddCourse = () => {
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState({
        name: "",
        category: "",
        description: "",
        lessons: [
            { id: 1, title: "", link: "" },
            { id: 2, title: "", link: "" }
        ]
    });

    const handleAddLesson = () => {
        setCourseData(prev => ({
            ...prev,
            lessons: [...prev.lessons, {
                id: prev.lessons.length + 1,
                title: "",
                link: ""
            }]
        }));
    };

    const handleRemoveLesson = (lessonId) => {
        setCourseData(prev => ({
            ...prev,
            lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
        }));
    };

    const handleLessonChange = (lessonId, value) => {
        setCourseData(prev => ({
            ...prev,
            lessons: prev.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, link: value } : lesson
            )
        }));
    };

    const handleInputChange = (field, value) => {
        setCourseData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // TODO: Implement API call to add course
        console.log(courseData);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return {
        courseData,
        handleAddLesson,
        handleRemoveLesson,
        handleLessonChange,
        handleInputChange,
        handleSubmit,
        handleBack
    };
}; 
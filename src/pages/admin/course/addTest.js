import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

//hooks
import { useTest } from '../../../hooks/admin/useTest';

//components
import Navbar from "../../../components/navbar";
import Header from "../../../components/admin/course/addTest/header";
import Body from "../../../components/admin/course/addTest/body";
import Footer from "../../../components/admin/course/addTest/footer";

//styles
import "../../../styles/admin/addTest/style.css";

const AddTest = () => {
    const navigate = useNavigate();
    const {
        testData,
        // loading,
        // error,
        testErrors,
        excelFile,
        handleTestInputChange,
        handleUploadExcel,
        handleSubmit,
        handleCancel,
        handleSubmitAndCreateTest,
        handleSubmitAndCreateLesson
    } = useTest();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUploadExcel(file);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (!result.success) {
            toast.error(result.error || 'Có lỗi xảy ra khi tạo bài kiểm tra');
        }
        if (result.success) {
            // toast.success(result.message || 'Bài kiểm tra đã được tạo thành công');
            navigate(`/coursePanel`);
        }
    };

    return (
        <div className="addTest">
            <Navbar />
            <div className="addTest__main-content">
                <Header />
                <div className="addTest__content-wrapper">
                    <Body 
                        testData={testData}
                        testErrors={testErrors}
                        excelFile={excelFile}
                        handleTestInputChange={handleTestInputChange}
                        handleFileChange={handleFileChange}
                        onSubmit={onSubmit}
                    />
                </div>
                <Footer 
                    handleCancel={handleCancel}
                    handleSubmitAndCreateTest={handleSubmitAndCreateTest}
                    handleSubmitAndCreateLesson={handleSubmitAndCreateLesson}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
};

export default AddTest;

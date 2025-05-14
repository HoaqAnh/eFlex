import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

//hooks
import { useTest } from '../../../hooks/admin/useTest';
import { useAuth } from "../../../hooks/useAuth";

//components
import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addTest/body";
import Footer from "../../../components/admin/course/addTest/footer";
import Loading from "../../../components/layout/loader/loading";

//styles
import "../../../styles/admin/addTest/style.css";

const AddTest = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const {
        testData,
        loading,
        error,
        testErrors,
        excelFile,
        handleTestInputChange,
        handleUploadExcel,
        handleSubmit,
        handleCancel,
        handleSubmitAndCreateTest,
        handleSubmitAndCreateLesson
    } = useTest();

    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

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
            toast.success(result.message || 'Bài kiểm tra đã được tạo thành công');
            navigate(`/admin/course`);
        }
    };



    return (
        <div className="addTest">
            {error && <div className="error-message">Có lỗi xảy ra vui lòng thử lại sau ít phút.</div>}
            {loading ? (
                <Loading Title="Đang tải lên khóa học..." />
            ) : (
                <>
                    <Header Title="Thêm bài kiểm tra" />
                    <Body
                        testData={testData}
                        testErrors={testErrors}
                        excelFile={excelFile}
                        handleTestInputChange={handleTestInputChange}
                        handleFileChange={handleFileChange}
                        onSubmit={onSubmit}
                    />
                    <Footer
                        handleCancel={handleCancel}
                        handleSubmitAndCreateTest={handleSubmitAndCreateTest}
                        handleSubmitAndCreateLesson={handleSubmitAndCreateLesson}
                        onSubmit={onSubmit}
                    />
                </>
            )}
        </div>
    );
};

export default AddTest;

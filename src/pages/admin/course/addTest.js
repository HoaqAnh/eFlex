import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    useCreTest,
    useCreMultipleChoiceTest,
    useCreListeningTest,
    useCreReadingTest
} from '../../../hooks/admin/useTest';
import Header from "../../../components/admin/course/addCourse/header";
import Body from "../../../components/admin/course/addTest/body";
import Footer from "../../../components/admin/course/addTest/footer";
import Loading from "../../../components/layout/loader/loading";
import Error from "../../../components/layout/loader/error";
import "../../../styles/admin/addTest/style.css";

const AddTest = () => {
    const navigate = useNavigate();
    const {
        testData, setTestData, loading: loadingTest, error: errorTest, testErrors,
        handleTestInputChange, validateTestForm, resetTestForm: resetMainTestForm, handleSubmitTest,
        courseId, lessonId
    } = useCreTest();

    const {
        loadingMC, errorMC, mcErrors, excelFileMC,
        handleUploadExcelMC, validateMCForm, resetMCForm, handleSubmitMC
    } = useCreMultipleChoiceTest();

    const {
        listeningData, loadingListening, errorListening, listeningErrors,
        audioFile, excelFileListening,
        handleListeningInputChange, handleUploadAudioFile, handleUploadListeningExcelFile,
        validateListeningForm, resetListeningForm, handleSubmitListening
    } = useCreListeningTest();

    const {
        readingData, loadingReading, errorReading, readingErrors,
        excelFileReading,
        handleReadingInputChange, handleUploadReadingExcelFile,
        validateReadingForm, resetReadingForm, handleSubmitReading
    } = useCreReadingTest();

    const [selectedTestTypes, setSelectedTestTypes] = useState({
        multipleChoice: false,
        listening: false,
        reading: false,
    });

    // Xử lý trường hợp courseId hoặc lessonId không hợp lệ từ useCreTest
    useEffect(() => {
        if (errorTest === 'Không tìm thấy courseId hoặc lessonId trong URL.') {
            toast.error(errorTest);
            navigate('/admin/course');
        }
    }, [errorTest, navigate]);


    const handleTestTypeChange = (type) => {
        setSelectedTestTypes(prev => {
            const newState = { ...prev, [type]: !prev[type] };
            if (!newState.multipleChoice && prev.multipleChoice) resetMCForm();
            if (!newState.listening && prev.listening) resetListeningForm();
            if (!newState.reading && prev.reading) resetReadingForm();
            return newState;
        });
    };

    const resetAllForms = () => {
        resetMainTestForm();
        resetMCForm();
        resetListeningForm();
        resetReadingForm();
        setSelectedTestTypes({ multipleChoice: false, listening: false, reading: false });
    };

    const handleOverallSubmit = async (e, navigateToLessonList = false, keepFormForNewTest = false) => {
        if (e) e.preventDefault();

        let isFormValid = true;
        let createdTestId = null;

        if (!validateTestForm()) {
            isFormValid = false;
        }

        const isAnyTypeSelected = selectedTestTypes.multipleChoice || selectedTestTypes.listening || selectedTestTypes.reading;
        if (!isAnyTypeSelected) {
            toast.error("Vui lòng chọn ít nhất một thể loại câu hỏi.");
            isFormValid = false;
        }

        if (selectedTestTypes.multipleChoice && !validateMCForm()) isFormValid = false;
        if (selectedTestTypes.listening && !validateListeningForm()) isFormValid = false;
        if (selectedTestTypes.reading && !validateReadingForm()) isFormValid = false;

        if (!isFormValid) {
            toast.error("Vui lòng kiểm tra lại các thông tin bắt buộc đã được điền đầy đủ và chính xác.");
            return;
        }

        // Bước 3: Tạo Test chính
        const testResult = await handleSubmitTest();

        if (!testResult || !testResult.success || !testResult.data || !testResult.data.id) {
            toast.error(testResult.error || "Tạo bài kiểm tra thất bại.");
            return;
        }
        createdTestId = testResult.data.id;
        toast.success(`Bài kiểm tra "${testData.name}" đã được tạo! Đang xử lý các phần chi tiết...`);

        // Bước 4: Submit các phần con
        let allSubPartsSuccessful = true;
        let mcSuccess = !selectedTestTypes.multipleChoice;
        let listeningSuccess = !selectedTestTypes.listening;
        let readingSuccess = !selectedTestTypes.reading;

        try {
            if (selectedTestTypes.multipleChoice) {
                const mcResult = await handleSubmitMC(createdTestId);
                if (mcResult && mcResult.success) {
                    toast.success("Phần trắc nghiệm đã được thêm thành công!");
                    mcSuccess = true;
                } else {
                    allSubPartsSuccessful = false;
                    toast.error(mcResult.error || "Lỗi tải lên file trắc nghiệm.");
                }
            }
            if (selectedTestTypes.listening) {
                const listeningResult = await handleSubmitListening(createdTestId);
                if (listeningResult && listeningResult.success) {
                    toast.success("Phần nghe đã được thêm thành công!");
                    listeningSuccess = true;
                } else {
                    allSubPartsSuccessful = false;
                    toast.error(listeningResult.error || "Lỗi tạo phần nghe.");
                }
            }
            if (selectedTestTypes.reading) {
                const readingResult = await handleSubmitReading(createdTestId);
                if (readingResult && readingResult.success) {
                    toast.success("Phần đọc hiểu đã được thêm thành công!");
                    readingSuccess = true;
                } else {
                    allSubPartsSuccessful = false;
                    toast.error(readingResult.error || "Lỗi tạo phần đọc hiểu.");
                }
            }

            allSubPartsSuccessful = mcSuccess && listeningSuccess && readingSuccess;

            if (allSubPartsSuccessful) {
                toast.success("Tất cả các phần của bài kiểm tra đã được xử lý thành công!");
                if (navigateToLessonList) {
                    navigate(`/admin/course/addCourse/${courseId}/addLesson`);
                } else if (keepFormForNewTest) {
                    resetAllForms();
                    toast.success("Form đã được làm mới để bạn tạo bài kiểm tra tiếp theo.");
                } else {
                    navigate(`/admin/course`);
                }
            } else {
                toast.error("Có lỗi xảy ra trong quá trình xử lý một số phần của bài kiểm tra. Vui lòng kiểm tra lại.");
            }
        } catch (overallError) {
            console.error("Lỗi tổng thể khi xử lý các phần con:", overallError);
            toast.error("Đã có lỗi nghiêm trọng xảy ra khi xử lý các phần con: " + overallError.message);
        }
    };

    const handleFileChangeMC = (e) => {
        const file = e.target.files[0];
        if (file) handleUploadExcelMC(file);
    };

    const handleAudioFileChangeListening = (e) => {
        const file = e.target.files[0];
        if (file) handleUploadAudioFile(file);
    };

    const handleExcelFileChangeListening = (e) => {
        const file = e.target.files[0];
        if (file) handleUploadListeningExcelFile(file);
    };

    const handleExcelFileChangeReading = (e) => {
        const file = e.target.files[0];
        if (file) handleUploadReadingExcelFile(file);
    };

    const handleCancel = () => {
        navigate(`/admin/course/addCourse/${courseId}/addLesson`);
    };

    const handleSubmitAndCreateLesson = () => handleOverallSubmit(null, true, false);
    const handleSubmitAndCreateTest = () => handleOverallSubmit(null, false, true);


    if (errorTest && errorTest !== 'Không tìm thấy courseId hoặc lessonId trong URL.') { // Hiển thị lỗi khác ngoài lỗi ID
        return <div className="addTest"><Error Title={`Có lỗi xảy ra: ${errorTest}. Vui lòng thử lại sau ít phút.`} /></div>
    }

    const isLoadingOverall = loadingTest || loadingMC || loadingListening || loadingReading;
    if (isLoadingOverall) {
        return <div className="addTest"><Loading Title="Đang xử lý dữ liệu..." /></div>
    }

    return (
        <div className="addTest">
            <Header Title="Thêm bài kiểm tra mới" />
            <Body
                testData={testData}
                testErrors={testErrors}
                handleTestInputChange={handleTestInputChange}

                selectedTestTypes={selectedTestTypes}
                handleTestTypeChange={handleTestTypeChange}

                // Multiple Choice Props
                mcData={{ excelFile: excelFileMC }}
                mcErrors={mcErrors}
                handleMCFileChange={handleFileChangeMC}

                // Listening Props
                listeningData={listeningData}
                listeningErrors={listeningErrors}
                audioFile={audioFile}
                excelFileListening={excelFileListening}
                handleListeningInputChange={handleListeningInputChange}
                handleListeningAudioFileChange={handleAudioFileChangeListening}
                handleListeningExcelFileChange={handleExcelFileChangeListening}

                // Reading Props
                readingData={readingData}
                readingErrors={readingErrors}
                excelFileReading={excelFileReading}
                handleReadingInputChange={handleReadingInputChange}
                handleReadingExcelFileChange={handleExcelFileChangeReading}
            />
            <Footer
                handleCancel={handleCancel}
                handleSubmitAndCreateTest={handleSubmitAndCreateTest}
                handleSubmitAndCreateLesson={handleSubmitAndCreateLesson}
                onSubmit={handleOverallSubmit}
            />
        </div>
    );
};

export default AddTest;
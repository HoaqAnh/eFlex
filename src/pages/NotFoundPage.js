import '../styles/layout/NotFoundPage.css';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-container">
            <div className="content404-wrapper">
                <div className="error404-code">404</div>
                <h1 className="error404-title">Trang không tìm thấy</h1>
                <p className="error404-message">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>
                <button className="home-button" onClick={handleGoHome}>
                    Về Trang Chủ
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
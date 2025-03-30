import React from 'react';

const Welcome = () => {
  return (
    <div className="welcome">
      <div className="welcome__content">
        <h2 className="welcome__title">Chào mừng bạn đến với eFlex</h2>
        <p className="welcome__text">
          Chúng tôi rất vui mừng khi bạn đã chọn EFlex làm người bạn đồng
          hành trên con đường học tập. EFlex là Hệ thống hỗ trợ học tập dựa
          trên năng lực cá nhân.
        </p>
        <div className="welcome__buttons">
          <button className="welcome__button welcome__button--primary">Bắt đầu</button>
          <button className="welcome__button welcome__button--secondary">Đọc thêm</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 
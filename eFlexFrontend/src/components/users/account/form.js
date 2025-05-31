import React, { useState } from 'react';

//style
import "../../../styles/users/account/form.css"

const Form = ({ type, isOpen, onClose, onSubmit, initialValue, label, options }) => {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSave = () => {
    setErrorMessage('');
    if (type === 'password') {
      if (!newPassword) {
        setErrorMessage('Vui lòng nhập mật khẩu mới.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('Mật khẩu mới và mật khẩu xác nhận không khớp.');
        return;
      }
      onSubmit(newPassword);
    } else if (type === 'avatar_url') {
      if (selectedFile) {
        onSubmit(selectedFile);
      } else {
        setErrorMessage('Vui lòng chọn ảnh đại diện.');
        return;
      }
    } else {
      onSubmit(inputValue);
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  let title = '';
  let content;

  switch (type) {
    case 'user_name':
      title = 'Thay đổi tên người dùng';
      content = (
        <div className="form-group">
          <label htmlFor="inputValue">Tên người dùng mới:</label>
          <input type="text" id="inputValue" className="form-control" value={inputValue} onChange={handleChange} />
        </div>
      );
      break;
    case 'address':
      title = 'Thay đổi địa chỉ';
      content = (
        <div className="form-group">
          <label htmlFor="inputValue">Địa chỉ mới:</label>
          <input type="text" id="inputValue" className="form-control" value={inputValue} onChange={handleChange} />
        </div>
      );
      break;
    case 'age':
      title = 'Thay đổi tuổi';
      content = (
        <div className="form-group">
          <label htmlFor="inputValue">Tuổi mới:</label>
          <input type="number" id="inputValue" className="form-control" value={inputValue} onChange={handleChange} />
        </div>
      );
      break;
    case 'education':
      title = 'Thay đổi trình độ học vấn';
      content = (
        <div className="form-group">
          <label htmlFor="inputValue">Trình độ học vấn mới:</label>
          <select id="inputValue" className="form-control" value={inputValue} onChange={handleChange}>
            {options && options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
      break;
    case 'avatar_url':
      title = 'Thay đổi ảnh đại diện';
      content = (
        <div className="form-group">
          <label htmlFor="avatar">Chọn ảnh mới:</label>
          <input type="file" id="avatar" className="form-control-file" onChange={handleFileChange} />
          {selectedFile && <p>Đã chọn: {selectedFile.name}</p>}
        </div>
      );
      break;
    case 'email':
      title = 'Thay đổi email';
      content = (
        <div className="form-group">
          <label htmlFor="inputValue">Email mới:</label>
          <input type="email" id="inputValue" className="form-control" value={inputValue} onChange={handleChange} />
        </div>
      );
      break;
    case 'auth_provider':
      title = 'Nhà cung cấp xác thực';
      content = (
        <div className="form-group">
          <p>Bạn không thể thay đổi nhà cung cấp xác thực tại đây.</p>
        </div>
      );
      break;
    case 'password':
      title = 'Thay đổi mật khẩu';
      content = (
        <>
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới:</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận Mật khẩu mới:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
        </>
      );
      break;
    default:
      return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="close-button" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {content}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Thoát
          </button>
          {type !== 'auth_provider' && (
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
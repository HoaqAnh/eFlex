import React, { useState } from "react";

//style
import "../../../styles/authentication/form.css"

const Form = ({ formData, handleChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form>
            <div className="register-body__right-form-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.523 21.99H4.488c-1.503 0-2.663-1.134-2.466-2.624l.114-.869c.207-1.2 1.305-1.955 2.497-2.214L11.928 15h.144l7.295 1.283c1.212.28 2.29.993 2.497 2.214l.114.88c.197 1.49-.963 2.623-2.466 2.623zM17 7A5 5 0 1 1 7 7a5 5 0 0 1 10 0" />
                </svg>
                <input
                    className="register-input"
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Họ tên"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="register-body__right-form-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                    <path fill="currentColor" d="M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-1.54 22H5.66l7-7.24l-1.44-1.39L4 26.84V9.52l12.43 12.37a2 2 0 0 0 2.82 0L32 9.21v17.5l-7.36-7.36l-1.41 1.41ZM5.31 8h25.07L17.84 20.47Z" />
                    <path fill="none" d="M0 0h36v36H0z" />
                </svg>
                <input
                    className="register-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />
            </div>

            <div className="register-body__right-form-group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                        <path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
                        <path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 1 1 12 0v2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" />
                    </g>
                </svg>
                <input
                    className="register-input"
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />
            </div>

            <div className="register-body__right-form-group last">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                        <path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
                        <path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 1 1 12 0v2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" />
                    </g>
                </svg>
                <input
                    className="register-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />
            </div>

            <div className="show-password">
                <button 
                    type="button" 
                    className="show-password-btn"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                </button>
            </div>
        </form>
    );
}

export default Form;
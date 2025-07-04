import React from 'react';

//style
import "../../../styles/authentication/form.css"

const Form = ({ formData, handleChange }) => (
    <form>
        <div className="login-body__right-form-group">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <path fill="currentColor" d="M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-1.54 22H5.66l7-7.24l-1.44-1.39L4 26.84V9.52l12.43 12.37a2 2 0 0 0 2.82 0L32 9.21v17.5l-7.36-7.36l-1.41 1.41ZM5.31 8h25.07L17.84 20.47Z" />
                <path fill="none" d="M0 0h36v36H0z" />
            </svg>
            <input
                className="login-input"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete='email'
                required
            />
        </div>

        <div className="login-body__right-form-group last">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeWidth="1">
                    <path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
                    <path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 1 1 12 0v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" />
                </g>
            </svg>
            <input
                className="login-input"
                id="password"
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                autoComplete='current-password'
                required
            />
        </div>

        <div className="forgot-password">
            <a href="/forget-password">Quên mật khẩu?</a>
        </div>
    </form>
)

export default Form;

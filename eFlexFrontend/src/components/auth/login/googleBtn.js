import React from 'react';
import { useGoogleLogin } from "@react-oauth/google";

//image
import googleLogo from "../../../assets/logo/google.png";

//style
import "../../../styles/button/style.css"

const GoogleBtn = () => {
  const login = useGoogleLogin({  
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: "http://localhost:3000/login/google",
    scope: "email profile",
    response_type: "code",
    onError: (errorResponse) => {
      console.error("Google Login Failed:", errorResponse);
    },
  });

  return (
    <button className="google-login-btn" onClick={login}>
      <img src={googleLogo} alt="Google" />
    </button>
  );
};

export default GoogleBtn;
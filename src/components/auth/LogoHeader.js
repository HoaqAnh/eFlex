import React from 'react';
import eFlexLogo from "../../assets/logo/eFlex.png";

const LogoHeader = () => {
  return (
    <div className="logo-header">
      <img src={eFlexLogo} alt="eFlex Logo" className="logo" />
      <h1>Rất vui được gặp bạn!</h1>
    </div>
  );
};

export default LogoHeader; 
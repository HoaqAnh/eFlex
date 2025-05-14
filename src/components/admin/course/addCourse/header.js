import React from "react";

//styles
import "../../../../styles/admin/addCourse/header.css";

const Header = ({ Title }) => (
    <div className="adminCourse-header">
        <h1>{Title}</h1>
    </div>
)

export default Header;
import React from "react";

//components
import Navbar from "../../../components/navbar";
import Header from "../../../components/admin/course/addTest/header";
import Body from "../../../components/admin/course/addTest/body";
import Footer from "../../../components/admin/course/addTest/footer";

//styles
import "../../../styles/admin/addTest/style.css";

const AddTest = () => {
    return (
        <div className="addTest-page">
            <Navbar />
            <div className="addTest-container">
                <Header />
                <Body />
                <Footer />
            </div>
        </div>
    );
};

export default AddTest;

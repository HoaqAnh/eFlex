import React from "react";

//components
import Body from "../../../components/admin/course/editCourse/body";
import Footer from "../../../components/admin/course/editCourse/footer";
import Header from "../../../components/admin/course/editCourse/header";
import Navbar from "../../../components/navbar";

//styles
import "../../../styles/admin/editCourse/style.css";

function EditCourse() {
    return (
        <div className="editCourse">
            <Navbar />
            <div className="editCourse__main-content">
                <Header />
                <div className="editCourse__content-wrapper">
                    <Body />
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default EditCourse;


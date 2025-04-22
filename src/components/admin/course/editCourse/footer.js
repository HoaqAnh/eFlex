import React from "react";

//styles
import "../../../../styles/admin/editCourse/footer.css";

function Footer() {
    return (
        <div className="editCourse-footer">
            <button className="btn btn-return">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M321.94 98L158.82 237.78a24 24 0 0 0 0 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18" />
                </svg>
                <p>Trở về</p>
            </button>
            <button className="btn btn-secondary">
                Cập nhật
            </button>
            <button className="btn btn-primary">
                Tiếp theo
            </button>
        </div>
    );
}

export default Footer;

import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useTests } from "../../../hooks/test/useTest";
import Header from "../../../components/users/test/header"
import Body from "../../../components/users/test/body"
import Footer from "../../../components/users/test/footer"
import Loading from "../../../components/layout/loader/loading"
import Error from "../../../components/layout/loader/error";
import "../../../styles/users/test/style.css"

const Test = () => {
    const { lessonId } = useParams();
    const { listTest, loading, error } = useTests(lessonId);
    const { checkAuth, user } = useAuth();
    const authCheck = checkAuth();

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    if (error) {
        return <Error Title="Có lỗi xảy ra, vui lòng thử lại sau ít phút!" />
    }
    return (
        <div className="test">
            {loading ? (
                <Loading Title="Bài kiểm tra đang được tải..." />
            ) : (
                <div className="test__content-card">
                    <Header />
                    <Body
                        User={user}
                        Tests={listTest}
                    />
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default Test;
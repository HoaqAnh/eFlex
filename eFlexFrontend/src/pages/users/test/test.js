import { useParams } from "react-router-dom";
import { useTests } from "../../../hooks/test/useTest";
import Header from "../../../components/users/test/header"
import Body from "../../../components/users/test/body"
import Footer from "../../../components/users/test/footer"
import Loading from "../../../components/layout/loader/loading"
import Error from "../../../components/layout/loader/error";
import useGetUserData from "../../../hooks/useUserData";
import "../../../styles/users/test/style.css"

const Test = () => {
    const { lessonId } = useParams();
    const { listTest, loading: listTestLoading, error: listTestError } = useTests(lessonId);
    const { userData, loading: userDataLoading, error: userDataError } = useGetUserData();

    if (listTestError || userDataError) {
        return <div className="test"><Error Title="Có lỗi xảy ra, vui lòng thử lại sau ít phút!" /></div>
    }

    if (listTestLoading || userDataLoading) {
        return <div className="test"><Loading Title="Bài kiểm tra đang được tải..." /></div>
    }
    return (
        <div className="test">
            <div className="test__content-card">
                <Header />
                <Body
                    User={userData}
                    Tests={listTest}
                />
                <Footer />
            </div>
        </div>
    );
}

export default Test;
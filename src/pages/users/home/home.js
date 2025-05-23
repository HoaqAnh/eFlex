import Header from "../../../components/users/home/header";
import Body from "../../../components/users/home/body";
import Loading from "../../../components/layout/loader/loading"
import Error from "../../../components/layout/loader/error"
import { useAuth, useGetUserData } from "../../../hooks/useAuth";
import "../../../styles/users/home/style.css";

const HomePage = () => {
  const { checkAuth } = useAuth();
  const authCheck = checkAuth();
  const { loading, error, userData } = useGetUserData();

  if (loading) {
    return <div className="home"><Loading Title="Đang tải dữ liệu người dùng..." /></div>
  }

  if (error) {
    return <div className="home"><Error Title="Lỗi tải dữ liệu người dùng, vui lòng thử lại sau ít phút!" /></div>
  }

  if (!authCheck.shouldRender) {
    return authCheck.component;
  }

  return (
    <div className="home">
      <Header UserData={userData} />
      <Body UserData={userData} />
    </div>
  );
}

export default HomePage;

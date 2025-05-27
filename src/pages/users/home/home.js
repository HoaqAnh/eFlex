import Header from "../../../components/users/home/header";
import Body from "../../../components/users/home/body";
import Loading from "../../../components/layout/loader/loading"
import Error from "../../../components/layout/loader/error"
import useGetUserData from "../../../hooks/useUserData.js";
import "../../../styles/users/home/style.css";

const HomePage = () => {
  const { loading, error, userData } = useGetUserData();

  if (loading) {
    return <div className="home"><Loading Title="Đang tải dữ liệu người dùng..." /></div>
  }

  if (error) {
    return <div className="home"><Error Title="Lỗi tải dữ liệu người dùng, vui lòng thử lại sau ít phút!" /></div>
  }

  return (
    <div className="home">
      <Header UserData={userData} />
      <Body UserData={userData} />
    </div>
  );
}

export default HomePage;

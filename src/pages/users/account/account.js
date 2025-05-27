import Header from "../../../components/users/account/header";
import Body from "../../../components/users/account/body";
import "../../../styles/users/account/style.css";

const Account = () => {
  return (
    <div className="account">
      <div className="account__main-content_card">
        <Header />
        <Body />
      </div>
    </div>

  );
}

export default Account;

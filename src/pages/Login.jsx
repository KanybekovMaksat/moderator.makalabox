import { useContext, useEffect } from "react";
import IsLoggedIn from "../assets/components/IsLoggedIn/IsLoggedIn";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store]);

  useEffect(() => {
    if (store.isAuth) {
      navigate("/moderator-page");
    }
  }, [store.isAuth, navigate]);

  return (
    <>
      <div className="container"></div>
      <IsLoggedIn />
    </>
  );
};

const ObservedLogin = observer(Login);

export default ObservedLogin;

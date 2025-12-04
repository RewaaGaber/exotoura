import { Outlet } from "react-router-dom";
import Loader from "../Components/Loader/Loader.jsx";
import { useRefetch } from "../Features/Auth";

const LoginPresist = () => {
  const { loading } = useRefetch();

  return loading ? <Loader /> : <Outlet />;
};

export default LoginPresist;

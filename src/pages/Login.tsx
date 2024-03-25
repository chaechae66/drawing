import { Link } from "react-router-dom";
import HomeBtn from "../components/HomeBtn";
import { FormEventHandler } from "react";

function Login() {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit">로그인</button>
      </form>
      <Link to={"/signup"}>아이디가 없다면...</Link>
      <HomeBtn />
    </div>
  );
}

export default Login;

import { Link, useNavigate } from "react-router-dom";
import HomeBtn from "../components/HomeBtn";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import axios from "axios";
import { LocalStorage } from "../lib/localStorage";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/user/userSlice";

function Login() {
  const [userInfo, setUserInfo] = useState({ id: "", password: "" });
  const localStorage = new LocalStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setUserInfo({ ...userInfo, [e.currentTarget.name]: e.currentTarget.value });
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!userInfo.id || !userInfo.password) {
      alert("빈 항목들을 채워주세요");
      return;
    }
    axios
      .post(`http://localhost:4000/user/login`, userInfo)
      .then((res) => {
        console.log(res.data);
        if (localStorage.get("token") || localStorage.get("expiredAt")) {
          alert("로그인된 상태입니다.");
          return;
        }
        localStorage.set("token", res.data.accessToken);
        localStorage.set("expiredAt", res.data.expireAt);

        dispatch(setUser({ id: res.data.id, nickname: res.data.nickname }));
        navigate("/");
      })
      .catch((err) => {
        if (err.response.data.message) {
          alert(err.response.data.message);
          return;
        }
        alert("회원가입에 실패하였습니다.");
        console.error(err);
      });
  };
  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={onSubmit}>
        <input
          value={userInfo.id}
          type="text"
          placeholder="아이디"
          autoComplete="username"
          onChange={onChange}
          name="id"
        />
        <input
          value={userInfo.password}
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          onChange={onChange}
          name="password"
        />
        <button type="submit">로그인</button>
      </form>
      <Link to={"/signup"}>아이디가 없다면...</Link>
      <HomeBtn />
    </div>
  );
}

export default Login;

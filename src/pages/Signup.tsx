import { Link } from "react-router-dom";
import HomeBtn from "../components/HomeBtn";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import axios from "axios";

function Signup() {
  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "",
    nickname: "",
  });
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:4000/user/signup`, userInfo)
      .then((res) => {
        console.log(res);
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

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setUserInfo({ ...userInfo, [e.currentTarget.name]: e.currentTarget.value });
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <input
          value={userInfo.id}
          onChange={onChange}
          type="text"
          placeholder="아이디"
          name="id"
        />
        <input
          value={userInfo.password}
          onChange={onChange}
          type="password"
          placeholder="비밀번호"
          name="password"
        />
        <input
          value={userInfo.nickname}
          onChange={onChange}
          type="text"
          placeholder="별명"
          name="nickname"
        />
        <button type="submit">완료</button>
      </form>
      <Link to={"/login"}>아이디가 있다면...</Link>
      <HomeBtn />
    </div>
  );
}

export default Signup;

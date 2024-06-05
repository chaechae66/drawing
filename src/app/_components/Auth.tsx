"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Button } from "../../../@/components/ui/button";
import HomeBtn from "./HomeBtn";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/store";
import { saveToken } from "src/store/features/token/tokenSlice";
import { setUser } from "src/store/features/user/userSlice";
import { useRouter } from "next/navigation";

function Auth() {
  const [loginUserInfo, setLoginUserInfo] = useState({ id: "", password: "" });
  const [signupUserInfo, setSignupUserInfo] = useState({
    id: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token);
  const router = useRouter();
  const onLoginChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setLoginUserInfo({
      ...loginUserInfo,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const onSignupChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setSignupUserInfo({
      ...signupUserInfo,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSignupSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (
      !signupUserInfo.id ||
      !signupUserInfo.password ||
      !signupUserInfo.passwordCheck ||
      !signupUserInfo.nickname
    ) {
      alert("빈 항목들을 채워주세요");
      return;
    }
    if (signupUserInfo.password !== signupUserInfo.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    fetch("http://localhost:3000/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupUserInfo),
    })
      .then(() => {
        setSignupUserInfo({
          id: "",
          password: "",
          passwordCheck: "",
          nickname: "",
        });
        alert("회원가입이 완료되었습니다. 로그인해주세요");
      })
      .catch((err) => {
        alert("회원가입에 실패하였습니다.");
        console.error(err);
      });
  };

  const onLoginSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!loginUserInfo.id || !loginUserInfo.password) {
      alert("빈 항목들을 채워주세요");
      return;
    }
    fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUserInfo),
    })
      .then((res) => res.json())
      .then((res) => {
        if (token.accessToken || token.refreshToken || token.expiredAt) {
          alert("이미 로그인된 상태입니다.");
          return;
        }

        const savedToken = {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          expiredAt: res.data.expiredAt,
        };

        dispatch(saveToken(savedToken));
        dispatch(setUser({ id: res.data.id, nickname: res.data.nickname }));
        router.push("/");
      })
      .catch((err) => {
        if (err.response.data.message) {
          alert(err.response.data.message);
          return;
        }
        alert("로그인에 실패하였습니다.");
        console.error(err);
      });
  };
  return (
    <main className="w-dvw h-full flex items-center justify-center p-6">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">로그인</TabsTrigger>
          <TabsTrigger value="signup">회원가입</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>로그인</CardTitle>
              <CardDescription>
                로그인을 하여 자신의 그림을 매력적으로 보여주세요!
              </CardDescription>
            </CardHeader>
            <form onSubmit={onLoginSubmit}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="id">아이디</Label>
                  <Input
                    id="id"
                    onChange={onLoginChange}
                    name="id"
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={onLoginChange}
                    name="password"
                    autoComplete="current-password"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit">완료</Button>
                <HomeBtn />
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>회원가입</CardTitle>
              <CardDescription>
                회원가입을 하여 우리의 가족이 되어주세요.
              </CardDescription>
            </CardHeader>
            <form onSubmit={onSignupSubmit}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="id">아이디</Label>
                  <Input
                    id="id"
                    onChange={onSignupChange}
                    name="id"
                    value={signupUserInfo.id}
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    onChange={onSignupChange}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={signupUserInfo.password}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="passwordCheck">비밀번호 확인</Label>
                  <Input
                    id="passwordCheck"
                    onChange={onSignupChange}
                    name="passwordCheck"
                    type="password"
                    autoComplete="new-password"
                    value={signupUserInfo.passwordCheck}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    onChange={onSignupChange}
                    name="nickname"
                    value={signupUserInfo.nickname}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit">완료</Button>
                <HomeBtn />
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default Auth;

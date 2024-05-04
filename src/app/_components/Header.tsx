"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/brush.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button } from "../../../@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { MouseEventHandler, useState } from "react";
import { removeToken } from "../../store/features/token/tokenSlice";
import { removeUser } from "../../store/features/user/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import AddDrawing from "../_components/AddDrawing";

export default function Header() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const onLogOut: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    dispatch(removeToken());
    dispatch(removeUser());
    queryClient.invalidateQueries({ queryKey: ["article"] });
  };

  return (
    <header className="h-14 flex justify-center border-b-[1px] border-solid border-gray-200 px-2 sticky top-0 bg-white">
      <div className="w-[768px] flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <Image src={Logo} width={20} height={20} alt="대표로고" />
          </Link>
        </div>
        <div className="mr-2 flex items-center">
          {!user.id || !user.nickname ? (
            <Link href={"/auth"}>
              <Button>로그인</Button>
            </Link>
          ) : (
            <>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <div>
                      {user.id && user.nickname && <>{user.nickname}님</>}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[100px]">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <div onClick={onLogOut} className="flex">
                        <LogOut className="mr-2 h-4 w-4" />
                        <div>로그아웃</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <div className="ml-2">
            <AddDrawing />
          </div>
        </div>
      </div>
    </header>
  );
}

import { useQueryClient } from "@tanstack/react-query";
import { MouseEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { removeToken } from "../store/features/token/tokenSlice";
import { removeUser } from "../store/features/user/userSlice";
import { RootState } from "../store/store";
import AddDrawing from "./AddDrawing";
import { Button } from "@/components/ui/button";
import Logo from "../assets/brush.svg?react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

function Layout() {
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
    <>
      <header className="h-14 flex justify-center border-b-[1px] border-solid border-gray-200 px-2 sticky top-0 bg-white">
        <div className="w-[768px] flex items-center justify-between">
          <div>
            <Link to={"/"}>
              <Logo />
            </Link>
          </div>
          <div className="mr-2 flex items-center">
            {!user.id || !user.nickname ? (
              <Link to={"/auth"}>
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
      <section className="px-2 min-h-dvh">
        <Outlet />
      </section>
      <footer className="bg-gray-200 flex items-center justify-center h-20">
        copyright&copy; 2024 All rights reserved Park Chae Yeon
      </footer>
    </>
  );
}

export default Layout;

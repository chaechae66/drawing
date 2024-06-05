import { NextRequest, NextResponse } from "next/server";
import User from "../../_model/user";
import bcrypt from "bcrypt";
import { jwtModule } from "../../_utils/jwt";

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();
    if (!id || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "아이디, 비밀번호는 필수 사항입니다.",
        },
        {
          status: 400,
        }
      );
    }

    const findUser = await User.findOne({ id });

    if (!findUser.id || !findUser.password) {
      return NextResponse.json(
        {
          success: false,
          message: "로그인 정보가 일치하지 않습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);

    if (!isPasswordCorrect || id !== findUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "로그인 정보가 일치하지 않습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const accessToken = jwtModule.sign(findUser.id);
    const { id: expiredId } = jwtModule.getExipreAt(accessToken);
    const refreshToken = jwtModule.refresh();

    return NextResponse.json(
      {
        success: true,
        data: {
          accessToken,
          refreshToken,
          id: findUser.id,
          nickname: findUser.nickname,
          expiredAt: expiredId,
        },
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        data: (e as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

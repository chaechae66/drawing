import { NextRequest, NextResponse } from "next/server";
import User from "../../_model/user";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { id, password, passwordCheck, nickname } = await req.json();
    if (!id || !password || !nickname) {
      return NextResponse.json(
        {
          success: false,
          message: "아이디, 비밀번호, nickname은 필수 사항입니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (password !== passwordCheck) {
      return NextResponse.json(
        {
          success: false,
          message: "비밀번호와 비밀번호 확인이 다릅니다.",
        },
        {
          status: 400,
        }
      );
    }

    const findUser = await User.findOne({ id });
    if (findUser) {
      return NextResponse.json(
        {
          success: false,
          message: "이미 가입된 아이디가 있습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id,
      nickname,
      password: hashedPassword,
    });
    await user.save();

    return NextResponse.json(
      {
        success: true,
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

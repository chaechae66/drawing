import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Comment from "src/app/api/_model/comment";
import User from "src/app/api/_model/user";
import { authJWT } from "src/app/api/_utils/jwt";

export async function PUT(req: NextRequest) {
  const imgId = req.nextUrl.searchParams.get("id");
  const commentId = req.nextUrl.searchParams.get("comment");
  const commentBody = await req.json();

  const uuid = headers().get("uuid");
  const token = headers().get("authorization");
  const loginID = token && authJWT(token!);

  if (!uuid) {
    return NextResponse.json(
      {
        success: false,
        message: "UUID가 존재하지 않습니다.",
      },
      {
        status: 400,
      }
    );
  }

  if (!imgId) {
    return NextResponse.json(
      {
        success: false,
        message: "들어온 이미지 ID가 없습니다.",
      },
      {
        status: 400,
      }
    );
  }
  if (!commentBody) {
    return NextResponse.json(
      {
        success: false,
        message: "들어온 코멘트가 없습니다.",
      },
      {
        status: 400,
      }
    );
  }
  if (!commentId) {
    return NextResponse.json(
      {
        success: false,
        message: "들어온 코멘트 ID가 없습니다.",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const comment = await Comment.findById(commentId);
    const userInfo = await User.findOne({ id: loginID });
    if (loginID && !userInfo) {
      return NextResponse.json(
        {
          success: false,
          message: "유저 정보가 일치하지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }
    if (
      comment.user ? comment.user !== uuid : comment.userInfo.id !== loginID
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "권한이 없습니다.",
        },
        {
          status: 401,
        }
      );
    }
    comment.body = commentBody;
    await comment.save();

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

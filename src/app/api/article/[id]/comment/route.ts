import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Comment from "../../../_model/comment";
import { headers } from "next/headers";
import { authJWT } from "../../../_utils/jwt";
import User from "../../../_model/user";
import Article from "../../../_model/article";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: imgId } = params;

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
  try {
    const commentsByArticleID = await Comment.find({
      articleID: new ObjectId(imgId),
    }).lean();

    return NextResponse.json(
      {
        success: true,
        data: commentsByArticleID,
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: imgId } = params;

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
  try {
    const userInfo = await User.findOne({ id: loginID });

    const comment = await req.json();

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
    const article = await Article.findById(imgId);

    const newComment = new Comment({
      articleID: new ObjectId(imgId),
      user: !loginID ? uuid : null,
      userInfo: loginID ? userInfo : null,
      body: comment,
      regDate: Date.now(),
    });

    article.commentCount++;

    await Promise.all([newComment.save(), article.save()]);

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

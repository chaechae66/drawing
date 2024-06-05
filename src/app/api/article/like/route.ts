import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Article from "src/app/api/_model/article";
import Like from "../../_model/list";
import { authJWT } from "../../_utils/jwt";
import User from "../../_model/user";

export async function GET(req: NextRequest) {
  const uuid = headers().get("uuid");
  const imgId = req.nextUrl.searchParams.get("id");
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
    const likeUsers = await Like.findOne({
      user: loginID ? loginID : uuid,
      articleID: new ObjectId(imgId),
    }).lean();
    return NextResponse.json(
      {
        success: true,
        data: likeUsers,
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

export async function POST(req: NextRequest) {
  const uuid = headers().get("uuid");
  const token = headers().get("authorization");
  const imgId = req.nextUrl.searchParams.get("id");

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

    const like = await Like.findOne({
      user: loginID ? loginID : uuid,
      articleID: new ObjectId(imgId),
    });

    if (!like) {
      const newLike = new Like({
        user: loginID ? loginID : uuid,
        isLike: true,
        articleID: new ObjectId(imgId),
      });
      article.likeCount++;
      await Promise.all([newLike.save(), article.save()]);
    } else if (like && like.isLike) {
      article.likeCount--;
      await Promise.all([
        Like.deleteOne({
          user: loginID ? loginID : uuid,
          articleID: new ObjectId(imgId),
        }),
        article.save(),
      ]);
    }

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

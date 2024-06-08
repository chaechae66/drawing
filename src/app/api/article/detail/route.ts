import { NextRequest, NextResponse } from "next/server";
import Article from "../../_model/article";
import { headers } from "next/headers";
import { authJWT } from "../../_utils/jwt";
import Like from "../../_model/list";
import { ObjectId } from "mongodb";
import Comment from "../../_model/comment";

export async function GET(req: NextRequest) {
  const imgId = req.nextUrl.searchParams.get("id");
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
    const detail = await Article.findById(imgId).lean();
    return NextResponse.json(
      {
        success: true,
        data: detail,
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

export async function PUT(req: NextRequest) {
  const imgId = req.nextUrl.searchParams.get("id");

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
    const formData = await req.formData();
    const drawingImage = formData.get("drawingImage") as File;
    if (!drawingImage || !drawingImage.name || !drawingImage.type) {
      return NextResponse.json(
        {
          success: false,
          data: "들어온 파일이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !(
        drawingImage.type == "image/png" ||
        drawingImage.type == "image/jpg" ||
        drawingImage.type == "image/jpeg"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          data: "들어온 파일이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const arrayBuffer = await drawingImage.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const post = await Article.findById(imgId);

    if (post.user ? post.user !== uuid : post.userInfo.id !== loginID) {
      return NextResponse.json(
        {
          success: false,
          data: "권한이 없습니다.",
        },
        {
          status: 401,
        }
      );
    }
    post.data = base64String;
    post.contentType = drawingImage.type;
    await post.save();
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

export async function DELETE(req: NextRequest) {
  const imgId = req.nextUrl.searchParams.get("id");

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
        message: "UUID가 존재하지 않습니다.",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const post = await Article.findById(imgId);

    if (post.user ? post.user !== uuid : post.userInfo.id !== loginID) {
      return NextResponse.json(
        {
          success: false,
          data: "권한이 없습니다.",
        },
        {
          status: 401,
        }
      );
    }
    await Promise.all([
      Article.findByIdAndDelete(imgId),
      Like.deleteMany({ articleID: new ObjectId(imgId) }),
      Comment.deleteMany({ articleID: new ObjectId(imgId) }),
    ]);
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

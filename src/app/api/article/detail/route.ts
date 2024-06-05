import { NextRequest, NextResponse } from "next/server";
import Article from "../../_model/article";

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

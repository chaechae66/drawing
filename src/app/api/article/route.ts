"use server";

import Article from "../_model/article";
import dbConnect from "../../../lib/db/dbConnect";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { authJWT } from "../_utils/jwt";
import User from "../_model/user";

dotenv.config();

async function GET() {
  try {
    await dbConnect();
    const imgList = await Article.find({}).lean();
    return NextResponse.json(
      {
        success: true,
        data: imgList,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

async function POST(req: NextRequest) {
  const uuid = headers().get("uuid");
  const token = headers().get("authorization");

  const userID = token && authJWT(token!);

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

    const userInfo = await User.findOne({ id: userID });
    if (userID && !userInfo) {
      return NextResponse.json(
        {
          success: false,
          data: "유저 정보가 일치하지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    const article = new Article({
      data: base64String,
      contentType: drawingImage.type,
      user: uuid,
      userInfo: token ? userInfo : null,
      regDate: Date.now(),
    });
    await article.save();
    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

export { GET, POST };

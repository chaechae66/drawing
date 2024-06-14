import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const secret = process.env.JWTSECRETKEY;

export const jwtModule = {
  sign: (userId: string) => {
    const payload = { id: userId };

    return jwt.sign(payload, secret!, {
      algorithm: "HS256",
      expiresIn: "3h",
    });
  },
  verify: (token: string) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret!);
      return {
        success: true,
        id: (decoded as JwtPayload).id,
      };
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
      };
    }
  },
  getExipreAt: (token: string) => {
    let decoded = null;
    try {
      decoded = jwt.decode(token, { complete: true });
      return {
        success: true,
        id: (decoded as JwtPayload).exp,
      };
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
      };
    }
  },
  refresh: () => {
    return jwt.sign({}, secret!, {
      algorithm: "HS256",
      expiresIn: "14d",
    });
  },
  refreshVerify: async (token: string) => {
    try {
      jwt.verify(token, secret!);
      return true;
    } catch (err) {
      return false;
    }
  },
};

export const authJWT = (_token: string) => {
  try {
    if (_token) {
      const token = _token.split("Bearer ")[1];
      const result = jwtModule.verify(token);

      if (result.success) {
        return result.id;
      } else {
        NextResponse.json(
          {
            success: false,
            message: result.message,
          },
          {
            status: 401,
          }
        );
      }
    } else {
      NextResponse.json(
        {
          success: false,
          message: "토큰 형식이 올바르지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }
  } catch (e) {
    NextResponse.json(
      {
        success: false,
        data: (e as Error).message,
      },
      {
        status: 500,
      }
    );
  }
};

import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { signUpSchema } from "@/schemas/schema";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { error, success, data: parsedData } = signUpSchema.safeParse(body);

    if (!success) {
      console.error("Zod Error", error);

      const formatedErrors = z.flattenError(error);

      return NextResponse.json(
        { message: "Validation error", error: formatedErrors.fieldErrors },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await UserModel.findOne({
      $or: [
        { email: parsedData.email.toLowerCase() },
        { userName: parsedData.userName.toLowerCase() },
      ],
    });

    if (existingUser) {
      if (existingUser.userName === parsedData.userName.toLowerCase()) {
        return NextResponse.json(
          {
            status: 409,
            message: "User name already exists",
          },
          { status: 409 },
        );
      }
      if (existingUser.email === parsedData.email.toLowerCase()) {
        return NextResponse.json(
          {
            status: 409,
            message: "Email already exists",
          },
          { status: 409 },
        );
      }
    }

    await UserModel.create(parsedData);

    return NextResponse.json(
      { status: 201, message: "Sign up successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign up api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

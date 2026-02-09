import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import UserModel, { IUser } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const personalization = await UserModel.findById<IUser>(
      session.user.id,
    ).select("personalizationPrompt");

    if (!personalization) {
      return NextResponse.json(
        {
          message: "No personalization found",
          status: "404",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Personalization successfully get",
      data: { prompt: personalization.personalizationPrompt },
    });
  } catch (error) {
    console.error("Personalization get api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

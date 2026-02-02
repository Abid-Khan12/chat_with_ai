import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import ConversationModel, { TConversation } from "@/models/conversation.model";
import { conversationTitleSchema } from "@/schemas/schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

    const conversationTitles = await ConversationModel.find<TConversation>({
      userId: session.user.id,
    })
      .select("title _id")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        status: 200,
        message: "Conversations successfully retrieved",
        data: conversationTitles,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Conversation get api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json();

  const {
    success,
    data: parsedBody,
    error,
  } = conversationTitleSchema.safeParse(body);

  if (!success) {
    const formatedErrors = z.flattenError(error);

    return NextResponse.json(
      { message: "Validation error", error: formatedErrors.fieldErrors },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const conversation = await ConversationModel.create({
      userId: session.user.id,
      title: parsedBody.title,
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Conversation created",
        data: { id: conversation._id, title: conversation.title },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Conversation post api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

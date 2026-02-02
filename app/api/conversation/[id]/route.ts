import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import ConversationModel, { TConversation } from "@/models/conversation.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("id");

  if (!conversationId) {
    return NextResponse.json(
      { status: 400, message: "Conversation ID not provided" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const conversation = await ConversationModel.findOne<TConversation>({
      _id: conversationId,
      userId: session.user.id,
    }).select("messages");

    if (!conversation) {
      return NextResponse.json(
        { status: 404, message: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Conversation successfully retrieved",
        data: conversation.messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Single Conversation get api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

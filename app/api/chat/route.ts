import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import ConversationModel, { TConversation } from "@/models/conversation.model";
import UsageModel, { TUsage } from "@/models/usage.model";
import UserModel from "@/models/user.model";
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
    const formattedErrors = z.flattenError(error);

    return NextResponse.json(
      { message: "Validation error", error: formattedErrors.fieldErrors },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const CHAT_LIMIT = 2;
    const RESET_DAYS = 1;

    // Get or create user usage
    let userUsage = await UsageModel.findOne<TUsage>({
      userId: session.user.id,
    });

    if (!userUsage) {
      // First time - create with resetAt set to future date
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + RESET_DAYS);

      userUsage = await UsageModel.create({
        userId: session.user.id,
        chatUsage: {
          resetAt: resetDate,
        },
      });
    }

    // Check if we need to reset usage
    const now = new Date();
    const shouldReset =
      userUsage!.chatUsage!.resetAt &&
      now >= new Date(userUsage!.chatUsage!.resetAt);

    if (shouldReset) {
      // Reset usage and set next reset date
      const nextResetDate = new Date();
      nextResetDate.setDate(nextResetDate.getDate() + RESET_DAYS);

      userUsage = await UsageModel.findOneAndUpdate(
        { userId: session.user.id },
        {
          $set: {
            "chatUsage.usage": 0,
            "chatUsage.resetAt": nextResetDate,
          },
        },
        { new: true },
      );
    }

    // Check if user has reached the limit
    if (userUsage!.chatUsage?.usage! >= CHAT_LIMIT) {
      return NextResponse.json(
        {
          status: 403,
          message: `Chat limit reached. You can create up to ${CHAT_LIMIT} conversations. Resets on ${new Date(userUsage!.chatUsage!.resetAt!).toLocaleDateString()}.`,
          data: {
            chatUsage: userUsage!.chatUsage?.usage,
            chatLimit: CHAT_LIMIT,
            resetAt: userUsage!.chatUsage!.resetAt,
          },
        },
        { status: 403 },
      );
    }

    // Create conversation
    const conversation = await ConversationModel.create({
      userId: session.user.id,
      title: parsedBody.title,
    });

    // Increment chat usage
    const updatedUsage = await UsageModel.findOneAndUpdate<TUsage>(
      { userId: session.user.id },
      { $inc: { "chatUsage.usage": 1 } },
      { new: true },
    );

    return NextResponse.json(
      {
        status: 201,
        message: "Conversation created successfully",
        data: {
          conversation: {
            id: conversation._id,
            title: conversation.title,
          },
          usage: {
            chatUsage: updatedUsage!.chatUsage!.usage,
            chatLimit: CHAT_LIMIT,
            resetAt: updatedUsage!.chatUsage!?.resetAt,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Conversation post api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 },
    );
  }
}

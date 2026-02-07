import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import ConversationModel, { TConversation } from "@/models/conversation.model";
import { messageSchema } from "@/schemas/schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }
  const { id: conversationId } = await params;

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
        data: { messages: conversation.messages },
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const RESET_AT = 1;
  const MESSAGE_LIMIT = 10;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }
  const body = await req.json();

  const { success, data: parsedBody, error } = messageSchema.safeParse(body);

  if (!success) {
    const formattedErrors = z.flattenError(error);

    return NextResponse.json(
      { message: "Validation error", error: formattedErrors.fieldErrors },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const { id: conversationId } = await params;

    let existingConvo = await ConversationModel.findOne({
      userId: session.user.id,
      _id: conversationId,
    });

    if (!existingConvo) {
      return NextResponse.json(
        { status: 404, message: "Conversation not found" },
        { status: 404 },
      );
    }

    if (!existingConvo.usage!.resetAt) {
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + RESET_AT);
      existingConvo.usage!.resetAt = resetDate;
      await existingConvo.save();
    }

    const now = new Date();
    const shouldReset =
      existingConvo.usage!.resetAt &&
      now >= new Date(existingConvo.usage!.resetAt);

    if (shouldReset) {
      const nextResetDate = new Date();
      nextResetDate.setDate(nextResetDate.getDate() + RESET_AT);

      existingConvo = await ConversationModel.findOneAndUpdate(
        { userId: session.user.id, _id: conversationId },
        {
          $set: {
            "usage.messageUsed": 0,
            "usage.resetAt": nextResetDate,
          },
        },
        { new: true },
      );
    }

    if (existingConvo!.usage!.messageUsed >= MESSAGE_LIMIT) {
      return NextResponse.json(
        {
          status: 403,
          message: `Message limit reached. You can create up to ${MESSAGE_LIMIT} messages. Resets on ${new Date(existingConvo!.usage!.resetAt).toLocaleDateString()}.`,
          data: {
            chatUsage: existingConvo!.usage!.messageUsed,
            chatLimit: MESSAGE_LIMIT,
            resetAt: existingConvo!.usage!.resetAt,
          },
        },
        { status: 403 },
      );
    }
    let shouldIncrement;
    let updatedConvo;
    if (parsedBody.role == "assistant") {
      shouldIncrement = true;
    }

    if (shouldIncrement) {
      updatedConvo = await ConversationModel.findOneAndUpdate(
        { userId: session.user.id, _id: conversationId },
        {
          $inc: {
            "usage.messageUsed": 1,
          },
          $push: {
            messages: {
              role: parsedBody.role,
              content: parsedBody.content,
            },
          },
        },
      );
    } else {
      updatedConvo = await ConversationModel.findOneAndUpdate(
        { userId: session.user.id, _id: conversationId },
        {
          $push: {
            messages: {
              role: parsedBody.role,
              content: parsedBody.content,
            },
          },
        },
      );
    }

    if (!updatedConvo) {
      return NextResponse.json(
        { status: 404, message: "Failed to save message" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Message saved successfully",
        data: {
          messageUsed: updatedConvo.usage.messageUsed,
          messageLimit: MESSAGE_LIMIT,
          resetAt: updatedConvo.usage.resetAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Chat Messages Post api error", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

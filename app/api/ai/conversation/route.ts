import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const model = google("gemini-3-flash-preview");

const SYSTEM_INSTRUCTIONS = `
You are a versatile, intelligent assistant. Your goal is to provide accurate, helpful, and context-aware responses.
1. **Persona**: Be professional yet conversational. 
2. **Capabilities**: 
   - For coding: Provide clean, modern, and secure code.
   - For writing: Be creative and adapt to the requested tone.
   - For analysis: Be logical, objective, and data-driven.
3. **Context**: You are helping a user in a Next.js application environment.
4. **Safety**: Do not generate harmful or illegal content.
`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages) {
      return NextResponse.json(
        { message: "No messages provided" },
        { status: 400 },
      );
    }

    const result = streamText({
      model,
      system: `${SYSTEM_INSTRUCTIONS} The current user is ${session.user.name || "a guest"}.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error occured in server", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 },
    );
  }
}

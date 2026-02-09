import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const model = google("gemini-3-flash-preview");

const SYSTEM_INSTRUCTIONS = `
You are a versatile, efficient assistant. Your goal is high information density with minimal token usage.
1. **Response Style**: Be direct. Omit conversational filler (e.g., "Sure," "I hope this helps"). 
2. **Structure**: Use Markdown headers and bullet points for complex topics. Use tables for comparisons.
3. **Brevity Rules**:
   - If a one-sentence answer suffices, provide only that.
   - For coding: Provide the solution first, then brief explanations only if the logic is non-obvious.
   - For analysis: Use "Key Takeaways" instead of long paragraphs.
4. **Typos**: Auto-correct obvious typos. For unclear ones, ask briefly: "Did you mean X?"
5. **Safety**: Strictly adhere to safety guidelines without lengthy preambles.
6. **Be concise**: If the user's request is simple, answer in one sentence. Do not repeat the user's prompt. Do not use 'As an AI...' or other meta-talk.
`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const personalization = session.user.prompt;

    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages) {
      return NextResponse.json(
        { message: "No messages provided" },
        { status: 400 },
      );
    }

    const result = streamText({
      model,
      system: `${SYSTEM_INSTRUCTIONS} User name: ${session.user.name || "User"} 
      User personalization:${personalization || "No personalization provided."}
      Follow personalization strictly when generating responses.`,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1500,
      temperature: 0.7,
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

import { Schema, models, model, InferSchemaType, Document } from "mongoose";

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const conversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: "",
      default: "",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    usage: {
      messageUsed: {
        type: Number,
        default: 0,
      },
      resetAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

export type TConversation = InferSchemaType<typeof conversationSchema>;

const ConversationModel =
  models.Conversation ||
  model<TConversation>("Conversation", conversationSchema);

export default ConversationModel;

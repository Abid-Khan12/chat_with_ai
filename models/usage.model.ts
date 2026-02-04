import { InferSchemaType, model, models, Schema } from "mongoose";

const usageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatUsage: {
    type: Number,
    default: 0,
  },
  resetAt: {
    type: Date,
    default: null,
  },
});

export type TUsage = InferSchemaType<typeof usageSchema>;

const UsageModel = models.Usage || model<TUsage>("Usage", usageSchema);

export default UsageModel;

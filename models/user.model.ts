import bcrypt from "bcryptjs";
import { Schema, models, model, InferSchemaType, Document } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    image_url: {
      type: String,
      default: "",
    },
    personalizationPrompt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (userPassword: string) {
  if (!this.password) return false;
  return bcrypt.compareSync(userPassword, this.password);
};

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: string;
  comparePassword: (userPassword: string) => Promise<boolean>;
};

const UserModel = models.User || model<IUser>("User", userSchema);

export default UserModel;

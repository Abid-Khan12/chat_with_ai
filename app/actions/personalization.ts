"use server";

import authOptions from "@/lib/auth";
import connectDB from "@/lib/db";
import UserModel, { IUser } from "@/models/user.model";
import { promptSchema } from "@/schemas/schema";
import { getServerSession } from "next-auth";
import z from "zod";

export async function savePersonalization(formData: FormData) {
  const raw = {
    personalizationPrompt: formData.get("personalizationPrompt"),
  };

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  const { success, error, data: parsedData } = promptSchema.safeParse(raw);

  if (!success) {
    console.error("Zod Error", error);

    const formatedErrors = z.flattenError(error);

    return {
      success: false,
      message: "Validation error",
      validaionError: formatedErrors.fieldErrors,
    };
  }

  try {
    await connectDB();

    const user = await UserModel.findByIdAndUpdate<IUser>(
      session.user.id,
      {
        personalizationPrompt: parsedData.personalizationPrompt,
      },
      { new: true },
    );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "Personalization Saved",
      data: { prompt: user?.personalizationPrompt },
    };
  } catch (error) {
    console.error("Save personalization server action error", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

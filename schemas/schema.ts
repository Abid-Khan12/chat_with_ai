import * as z from "zod";

export const signUpSchema = z.object({
  userName: z
    .string()
    .min(1, "User name is required")
    .max(40, "Maximum 40 characters"),
  email: z
    .email({ error: "Invalid email address" })
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Minimum 8 characters long")
    .max(20, "Maximum 20 characters"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const conversationTitleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(80, "Maximum 80 characters"),
});

export type conversationTitleFormData = z.infer<typeof conversationTitleSchema>;

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1, "Content is required"),
});

export type MessageFormData = z.infer<typeof messageSchema>;

export const promptSchema = z.object({
  personalizationPrompt: z
    .string()
    .min(1, "Prompt is required")
    .max(300, "Maximum 300 characters"),
});

export type PromptFormData = z.infer<typeof promptSchema>;

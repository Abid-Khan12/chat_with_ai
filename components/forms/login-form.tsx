"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/schemas/schema";

import Link from "next/link";
import PasswordField from "../inputs/password-field";
import InputField from "../inputs/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const { control, reset, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: LoginFormData) => {
    const payload = { ...values };

    const result = await signIn("credentials", { ...payload, redirect: false });

    if (!result?.ok) {
      toast.error(result?.error);
      return;
    }

    toast.success("Login in successfully");

    reset();

    router.replace("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Login to your account
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-3">
            <InputField
              control={control}
              name="identifier"
              maxLength={60}
              placeholder="Jhon or Jhon@example.com"
              label="Username/Email"
            />
            <PasswordField
              control={control}
              name="password"
              placeholder="********"
              label="Password"
              maxLength={30}
            />
            <Field className="mt-2 space-y-2">
              <Button type="submit">Login</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => signIn("google")}
              >
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

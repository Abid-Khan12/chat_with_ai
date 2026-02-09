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
// import { useForm } from "react-hook-form";
// import { LoginFormData, loginSchema } from "@/schemas/schema";

import Link from "next/link";
import PasswordField from "../inputs/password-field";
import InputField from "../inputs/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleIcon } from "../tailark-elements/icon";

const LoginForm = () => {
  // const router = useRouter();
  // const { control, reset, handleSubmit } = useForm<LoginFormData>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: {
  //     identifier: "",
  //     password: "",
  //   },
  //   mode: "all",
  // });

  // const onSubmit = async (values: LoginFormData) => {
  //   const payload = { ...values };

  //   const result = await signIn("credentials", { ...payload, redirect: false });

  //   if (!result?.ok) {
  //     toast.error(result?.error);
  //     return;
  //   }

  //   toast.success("Login in successfully");

  //   reset();

  //   router.replace("/");
  // };

  return (
    <Card className="h-full min-h-50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Get started in seconds
        </CardTitle>
        <CardDescription>
          One click with Google and you're in. Simple, secure, and fast.
        </CardDescription>
      </CardHeader>
      <CardContent className="grow h-full flex items-center justify-center">
        {/* <form> */}
        {/* <FieldGroup className="items-center justify-center h-full grow"> */}
        {/* <InputField
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
            /> */}
        <Field className="">
          {/* <Button type="submit">Login</Button> */}
          <Button
            variant="outline"
            type="button"
            onClick={() => signIn("google")}
            size={"lg"}
          >
            <GoogleIcon className="size-6" />
            Login with Google
          </Button>
          {/* <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up">Sign up</Link>
              </FieldDescription> */}
        </Field>
        {/* </FieldGroup> */}
        {/* </form> */}
      </CardContent>
    </Card>
  );
};

export default LoginForm;

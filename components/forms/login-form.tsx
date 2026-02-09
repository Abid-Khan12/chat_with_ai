"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { signIn } from "next-auth/react";

import { GoogleIcon } from "../tailark-elements/icon";

const LoginForm = () => {
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
        <Field className="">
          <Button
            variant="outline"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
            size={"lg"}
          >
            <GoogleIcon className="size-6" />
            Login with Google
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

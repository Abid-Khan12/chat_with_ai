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
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/schemas/schema";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Link from "next/link";
import InputField from "../inputs/input-field";
import PasswordField from "../inputs/password-field";
import useCustomMutation from "@/hooks/use-mutation";

const SignupForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCustomMutation<{}, SignUpFormData>({
    api_key: ["signup_mutation"],
    api_url: "/api/auth/sign-up",
  });
  const { control, reset, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (values: SignUpFormData) => {
    mutate(
      { payload: { ...values } },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          router.replace("/auth/login");
          reset();
        },
        onError: ({ message, validationErrors }) => {
          if (validationErrors) {
            Object.entries(validationErrors).forEach(([field, errors]) => {
              toast.error(`${field}: ${errors[0]}`);
            });
            return;
          }

          toast.error(message);
          return;
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-3">
            <InputField
              control={control}
              name="userName"
              placeholder="Jhon Dev"
              label="User name"
              maxLength={60}
            />
            <InputField
              control={control}
              name="email"
              label="Email"
              placeholder="Jhon@example.com"
            />
            <PasswordField
              control={control}
              name="password"
              placeholder="********"
              label="Password"
              maxLength={30}
            />
            <Field className="mt-2 space-y-2">
              <Button disabled={isPending} type="submit">
                {isPending && <Loader className="animate-spin" />}
                Create Account
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isPending}
                onClick={() => signIn("google")}
              >
                Sign up with Google
              </Button>
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link href="/auth/login">Login</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;

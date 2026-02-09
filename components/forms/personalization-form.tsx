"use client";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Textarea } from "../ui/textarea";
import { PromptFormData, promptSchema } from "@/schemas/schema";
import { Button } from "../ui/button";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { savePersonalization } from "@/app/actions/personalization";
import useFetch from "@/hooks/use-fetch";
import useAppContext from "@/context/app-context";
import { useSession } from "next-auth/react";

interface FetchResponse {
  data: {
    message: string;
    prompt: string;
  };
}

const PersonalizationForm = () => {
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();

  const { data, isLoading } = useFetch<FetchResponse>({
    api_key: ["personalization_fetch"],
    api_url: "/api/personalization",
  });

  const { control, reset, handleSubmit } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      personalizationPrompt: "",
    },
    mode: "all",
  });

  const handleAction = async (values: PromptFormData) => {
    const formData = new FormData();

    formData.append("personalizationPrompt", values.personalizationPrompt);

    startTransition(async () => {
      const { message, success, validaionError, data } =
        await savePersonalization(formData);

      if (!success) {
        if (validaionError) {
          Object.entries(validaionError).forEach(([field, errors]) => {
            toast.error(`${errors[0]}`);
          });
          return;
        }

        toast.error(message);
        return;
      }

      toast.success(message);
      await updateSession({
        prompt: data?.prompt,
      });
      });
  };

  useEffect(() => {
    if (!isLoading) {
      reset({
        personalizationPrompt: data?.data.prompt,
      });
    }
  }, [data, isLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Personalization
        </CardTitle>
        <CardDescription>Customize your experience here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleAction)}>
          <FieldGroup className="space-y-3">
            <Controller
              control={control}
              name="personalizationPrompt"
              render={({ field, fieldState }) => (
                <Field className="w-full relative">
                  <FieldLabel htmlFor="prompt">Personalization</FieldLabel>
                  <FieldContent>
                    <Textarea
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      id="prompt"
                      className="resize-none h-30"
                      placeholder={
                        isLoading
                          ? "fetching prompt..."
                          : "Add your interests, goals, and preferences"
                      }
                      {...field}
                    />
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError
                      className="absolute -bottom-6 left-0"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button
                disabled={isPending || isLoading}
                type="submit"
                size={"lg"}
              >
                Add Personalization
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalizationForm;

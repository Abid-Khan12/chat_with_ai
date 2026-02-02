"use client";

import { useState } from "react";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Controller, FieldValues, Path, Control } from "react-hook-form";
import { Button } from "../ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { PrimaryInputProps } from "@/types/types";

const PasswordField = <T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  maxLength,
}: PrimaryInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="relative w-full">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <FieldContent className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              id={name}
              placeholder={placeholder}
              maxLength={maxLength}
              {...field}
            />
            <Button
              className={"absolute top-0 right-0 h-full"}
              size={"icon-sm"}
              variant={"ghost"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </Button>
          </FieldContent>
          {fieldState.error && (
            <FieldError
              className="absolute -bottom-6 left-0"
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  );
};

export default PasswordField;

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { PrimaryInputProps } from "@/types/types";
import { Controller, FieldValues } from "react-hook-form";

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  maxLength,
  type = "text",
}: PrimaryInputProps<T> & { type?: string }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="relative w-full">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <FieldContent>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              maxLength={maxLength}
              {...field}
            />
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

export default InputField;

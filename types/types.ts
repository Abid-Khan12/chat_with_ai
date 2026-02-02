import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export interface PrimaryInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  maxLength?: number;
}

export type PrimaryChildrenProp = Readonly<{
  children: React.ReactNode;
}>;

"use client";
import { Sparkle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const PersonalizationForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Personalization
        </CardTitle>
        <CardDescription>Customize your experience here.</CardDescription>
      </CardHeader>
      <CardContent className="h-50 flex items-center justify-center">
        <h1 className="font-bold text-2xl">COMING SOON</h1>
      </CardContent>
    </Card>
  );
};

export default PersonalizationForm;

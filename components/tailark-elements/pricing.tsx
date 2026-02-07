import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="w-full" id="pricing">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground">
          Start for free and explore the power of AI. Our upcoming premium tiers
          will offer advanced capabilities for power users and teams.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2">
        {/* FREE PLAN */}
        <Card className="flex flex-col border-primary/20">
          <CardHeader>
            <CardTitle className="font-medium">Free Tier</CardTitle>
            <span className="block text-2xl font-semibold">$0 / mo</span>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            <hr className="border-dashed" />
            <ul className="list-outside space-y-3 text-sm">
              {[
                "2 AI Chat Sessions per day",
                "10 Messages per chat session",
                "Standard Response Speed",
                "Access to Gemini AI Model",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="size-3 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* COMING SOON - PRO */}
        <Card className="relative opacity-80 border-dashed">
          <CardContent className="h-full flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-muted-foreground">
                PRO
              </h2>
              <p className="text-xs uppercase tracking-widest mt-1 opacity-50">
                Coming Soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

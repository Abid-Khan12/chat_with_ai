import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import { ReactNode } from "react";

export default function Features() {
  return (
    <section className="dark:bg-transparent" id="features">
      <div className="@container w-full">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Built for the way you think
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful features designed to make your AI interactions faster and
            more productive.
          </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-12">
          {/* Card 1: Speed/Efficiency */}
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Lightning Fast</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Zero lag, instant responses. Chat_With_AI is optimized for speed
                so your creative flow never hits a wall.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Privacy/Security */}
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2 className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Privacy First</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Your data is your business. We provide secure, encrypted
                conversations that keep your ideas safe and private.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: AI Intelligence */}
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Smart Context</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Beyond simple prompts. Our AI understands deep context,
                remembers your preferences, and provides tailored results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);

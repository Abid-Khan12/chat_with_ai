import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export default function HeroSection() {
  return (
    <section className="relative pt-32">
      <div className="text-center">
        <TextEffect
          preset="fade-in-blur"
          speedSegment={0.3}
          as="h1"
          className="text-balance text-4xl max-md:font-semibold md:text-6xl lg:text-7xl xl:text-[5.25rem]"
        >
          Smarter Conversations Start Here
        </TextEffect>
        <TextEffect
          per="line"
          preset="fade-in-blur"
          speedSegment={0.3}
          delay={0.5}
          as="p"
          className="mx-auto mt-7 max-w-2xl text-balance md:text-lg"
        >
          No fluff. Just a powerful, intuitive AI interface designed to give you
          the answers you need, exactly when you need them.
        </TextEffect>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="mt-7 flex items-center justify-center"
        >
          <Button
            size="lg"
            className="rounded-xl px-5 text-base"
            render={<Link href={"/chat"} />}
            nativeButton={false}
          >
            <span className="text-nowrap">Start Chatting</span>
          </Button>
        </AnimatedGroup>
      </div>
    </section>
  );
}

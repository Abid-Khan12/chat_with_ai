"use client";

import { useScroll } from "@/hooks/use-scroll";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/navbar/mobile-nav";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, Settings2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

import Link from "next/link";
import useAppContext from "@/context/app-context";
import { ModeToggle } from "../ui/mode-toggle";

export const navLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

export function Header() {
  const { userData, status } = useAppContext();
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-transparent border-b px-2",
        {
          "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 border-border":
            scrolled,
        },
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between">
        <Link
          href={"/"}
          className="rounded-md p-2 hover:bg-accent cursor-pointer shrink-0"
        >
          <span className="font-medium">Chat_With_AI</span>
        </Link>
        <div className="md:flex hidden items-center justify-center gap-4 grow w-full">
          {navLinks.map((link, i) => (
            <a
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
              key={i}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <MobileNav />
          <div className="md:hidden block">
            <ModeToggle />
          </div>
          {status == "loading" ? (
            <Skeleton className="size-8 rounded-full" />
          ) : (
            <>
              {userData ? (
                <>
                  <UserAvatar
                    image={userData.image!}
                    name={userData.name!}
                    email={userData.email!}
                  />
                </>
              ) : (
                <Button
                  nativeButton={false}
                  render={<Link href={"/auth/login"}>Login</Link>}
                />
              )}
            </>
          )}
          <div className="md:block hidden">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

export const UserAvatar = ({
  image,
  name,
}: {
  image: string;
  name: string;
  email: string;
}) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="rounded-full" />}
      >
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={`min-w-50 space-y-2`}
      >
        <DropdownMenuGroup className={`space-y-2`}>
          <DropdownMenuItem render={<Link href={"/personalization"} />}>
            <Settings2 />
            Personalization
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";

import { useScroll } from "@/hooks/use-scroll";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/navbar/mobile-nav";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";

import Link from "next/link";
import useAppContext from "@/context/app-context";
import { Skeleton } from "../ui/skeleton";

export const navLinks = [
  {
    label: "Features",
    href: "#",
  },
  {
    label: "Pricing",
    href: "#",
  },
  {
    label: "About",
    href: "#",
  },
];

export function Header() {
  const { userData, status } = useAppContext();
  const scrolled = useScroll(10);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-2">
        <Link
          href={"/"}
          className="rounded-md p-2 hover:bg-accent cursor-pointer"
        >
          <span className="font-medium">Chat-With-AI</span>
        </Link>
        <div className="md:flex hidden items-center justify-center gap-2 grow">
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
          {status == "loading" ? (
            <Skeleton className="size-8 rounded-full" />
          ) : (
            <>
              {userData ? (
                <>
                  <Button
                    nativeButton={false}
                    className={`md:inline-flex hidden`}
                    render={<Link href={"/chat"}>Get started</Link>}
                  />
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
        </div>
      </nav>
    </header>
  );
}

export const UserAvatar = ({
  image,
  name,
  email,
}: {
  image: string;
  name: string;
  email: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={`min-w-50 space-y-2`}
      >
        <DropdownMenuGroup className={`space-y-2`}>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

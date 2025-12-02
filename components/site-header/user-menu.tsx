"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedIcon, type AnimatedIconHandle } from "@/components/animated-icon";
import settingsIcon from "@/public/icons/settings.json";
import signOutIcon from "@/public/icons/sign-out.json";
import { springTransition } from "./animations";
import type { AccountProfile } from "@/lib/profile-utils";

type UserMenuProps = {
  account: AccountProfile;
  onSignOut: () => void;
  signingOut: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function UserMenu({
  account,
  onSignOut,
  signingOut,
  isOpen,
  setIsOpen,
}: UserMenuProps) {
  const settingsIconRef = React.useRef<AnimatedIconHandle>(null);
  const signOutIconRef = React.useRef<AnimatedIconHandle>(null);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group h-10 gap-2 rounded-full border border-border/40 bg-muted/20 pl-1 pr-4 transition-all duration-200 ease-in-out hover:bg-muted/40 data-[state=open]:bg-muted/40"
        >
          <Avatar className="h-8 w-8 border border-border/20 transition-opacity duration-200 group-hover:opacity-90">
            <AvatarImage
              src={account.avatarUrl ?? undefined}
              alt={account.displayName ?? "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-xs font-medium text-primary-foreground">
              {account.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[100px] truncate text-sm font-medium text-foreground/80 transition-colors duration-200 group-hover:text-foreground lg:inline-block">
            {account.displayName}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={springTransition}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground/70 transition-colors duration-200 group-hover:text-foreground" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex max-w-[180px] flex-col space-y-1">
            <p className="truncate text-sm font-medium leading-none">
              {account.displayName}
            </p>
            <p className="truncate text-xs leading-none text-muted-foreground">
              {account.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          asChild
          onMouseEnter={() => settingsIconRef.current?.play()}
        >
          <Link href="/settings" onClick={() => setIsOpen(false)}>
            <div className="mr-2 size-4 flex items-center justify-center">
              <AnimatedIcon
                ref={settingsIconRef}
                icon={settingsIcon}
                size={16}
                className="text-muted-foreground"
              />
            </div>
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={onSignOut}
          disabled={signingOut}
          onMouseEnter={() => signOutIconRef.current?.play()}
        >
          <div className="mr-2 size-4 flex items-center justify-center">
            <AnimatedIcon
              ref={signOutIconRef}
              icon={signOutIcon}
              size={16}
              className="text-destructive"
            />
          </div>
          <span>{signingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

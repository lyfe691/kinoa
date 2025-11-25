"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, ChevronDown, Settings as SettingsIcon } from "lucide-react";
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
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-lg px-3 hover:bg-accent data-[state=open]:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={account.avatarUrl ?? undefined}
              alt={account.displayName ?? "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-xs font-medium text-primary-foreground">
              {account.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[100px] truncate text-sm font-semibold lg:inline-block">
            {account.displayName}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={springTransition}
          >
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
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
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/settings" onClick={() => setIsOpen(false)}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={onSignOut}
          disabled={signingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{signingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

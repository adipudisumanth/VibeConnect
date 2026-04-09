import {
  Plus,
  LayoutGrid,
  FileText,
  User,
  LogOut,
  Briefcase,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";

interface NavbarProps {
  role: "FOUNDER" | "VIBECODER";
}

export function Navbar({ role }: NavbarProps) {
  const isFounder = role === "FOUNDER";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Brand Name */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-primary font-heading"
        >
          VibeConnect
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* 1. STANDALONE BUTTONS (Hidden on mobile, visible on sm and up) */}
          {isFounder ? (
            <Button className="hidden sm:flex h-12 items-center gap-2 px-6 text-base shadow-md">
              <Plus className="h-5 w-5" />
              Create Project
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="hidden sm:flex h-12 items-center gap-2 px-6 text-base shadow-sm"
            >
              <Briefcase className="h-5 w-5" />
              Applications
            </Button>
          )}

          {/* Avatar & Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 ring-2 ring-transparent hover:ring-border transition-all"
              >
                <Avatar className="h-full w-full border border-border">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                    VC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-semibold leading-none text-foreground">
                    Alex Rivera
                  </p>
                  <p className="text-sm leading-none text-muted-foreground capitalize">
                    {role.toLowerCase()}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* 2. RESPONSIVE MOBILE ACTIONS (Visible ONLY on mobile) */}
              <DropdownMenuGroup className="sm:hidden p-1">
                {isFounder ? (
                  <DropdownMenuItem className="cursor-pointer py-3 font-medium text-primary focus:bg-primary/10">
                    <Plus className="mr-3 h-5 w-5" />
                    <span>Create Project</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="cursor-pointer py-3 font-medium text-primary focus:bg-primary/10">
                    <Briefcase className="mr-3 h-5 w-5" />
                    <span>Applications</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </DropdownMenuGroup>

              {/* 3. SHARED MENU ITEMS */}
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem asChild className="cursor-pointer py-3">
                  <Link href="/profile" className="flex w-full items-center">
                    <User className="mr-3 h-5 w-5" />
                    <span className="text-sm">Profile</span>
                  </Link>
                </DropdownMenuItem>

                {isFounder ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <LayoutGrid className="mr-3 h-5 w-5" />
                      <span className="text-sm">My Projects</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <FileText className="mr-3 h-5 w-5" />
                      <span className="text-sm">My Stories</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <LayoutGrid className="mr-3 h-5 w-5" />
                    <span className="text-sm">My Applications</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer py-3 text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-sm font-medium">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

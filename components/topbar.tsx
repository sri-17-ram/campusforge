'use client'

import { Search, Bell, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-lg">
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 items-center gap-2 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search projects, people, skills..."
            className="h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold text-foreground">User Name</p>
                <p className="text-xs text-muted-foreground">user@campus.dev</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

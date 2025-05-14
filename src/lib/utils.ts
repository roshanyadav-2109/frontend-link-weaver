
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to a more readable format
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Helper to create premium gradient text
export function createGradientText(text: string, className?: string): React.ReactNode {
  return React.createElement(
    "span",
    { 
      className: `bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-teal ${className || ''}` 
    },
    text
  );
}

// Helper to add blur effect to elements behind main content
export function createPremiumBackground(): React.ReactNode {
  return React.createElement(
    "div",
    { className: "absolute inset-0 -z-10 overflow-hidden" },
    [
      React.createElement(
        "div",
        { 
          key: "blue-blur",
          className: "absolute left-[50%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-brand-blue/20 blur-[10rem]" 
        }
      ),
      React.createElement(
        "div",
        { 
          key: "teal-blur",
          className: "absolute right-[25%] top-[25%] h-[20rem] w-[20rem] rounded-full bg-brand-teal/20 blur-[10rem]" 
        }
      )
    ]
  );
}

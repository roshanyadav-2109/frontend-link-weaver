
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  if (!name) return "";
  
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (
    parts[0].charAt(0).toUpperCase() + 
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

export function createPremiumBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 left-0 h-48 bg-gradient-to-tl from-blue-500/20 to-teal-500/20 blur-3xl transform translate-y-1/2"></div>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      <div className="absolute inset-0" style={{ 
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2%, transparent 0%)`, 
        backgroundSize: '50px 50px' 
      }}></div>
    </div>
  );
}

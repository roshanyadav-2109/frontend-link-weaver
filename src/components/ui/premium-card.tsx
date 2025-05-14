
import * as React from "react"
import { cn } from "@/lib/utils"

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  clickable?: boolean;
  hoverEffect?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = 'default', clickable, hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-6 shadow-premium transition-all duration-300",
          variant === 'default' && "bg-white border border-gray-100",
          variant === 'glass' && "bg-white/70 backdrop-blur-md border border-white/20",
          variant === 'gradient' && "bg-gradient-to-br from-brand-blue to-brand-teal text-white",
          hoverEffect && "hover:shadow-xl hover:-translate-y-1",
          clickable && "cursor-pointer",
          className
        )}
        {...props}
      />
    )
  }
)
PremiumCard.displayName = "PremiumCard"

interface PremiumCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardHeader = React.forwardRef<HTMLDivElement, PremiumCardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-4", className)}
        {...props}
      />
    )
  }
)
PremiumCardHeader.displayName = "PremiumCardHeader"

interface PremiumCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const PremiumCardTitle = React.forwardRef<HTMLHeadingElement, PremiumCardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-xl font-bold", className)}
        {...props}
      />
    )
  }
)
PremiumCardTitle.displayName = "PremiumCardTitle"

interface PremiumCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const PremiumCardDescription = React.forwardRef<HTMLParagraphElement, PremiumCardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-gray-600", className)}
        {...props}
      />
    )
  }
)
PremiumCardDescription.displayName = "PremiumCardDescription"

interface PremiumCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardContent = React.forwardRef<HTMLDivElement, PremiumCardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      />
    )
  }
)
PremiumCardContent.displayName = "PremiumCardContent"

interface PremiumCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardFooter = React.forwardRef<HTMLDivElement, PremiumCardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-6 flex items-center", className)}
        {...props}
      />
    )
  }
)
PremiumCardFooter.displayName = "PremiumCardFooter"

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
  PremiumCardFooter,
}

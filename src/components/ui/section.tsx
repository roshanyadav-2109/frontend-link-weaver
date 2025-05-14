
import * as React from "react"
import { cn } from "@/lib/utils"
import { createPremiumBackground } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string;
  backgroundEffect?: 'none' | 'gradient' | 'blur';
  fullWidth?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    containerClassName,
    backgroundEffect = 'none',
    fullWidth = false,
    children,
    ...props 
  }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "py-16 relative",
          backgroundEffect === 'gradient' && "bg-gradient-to-br from-brand-blue to-brand-teal text-white",
          className
        )}
        {...props}
      >
        {backgroundEffect === 'blur' && createPremiumBackground()}
        
        <div className={cn(
          fullWidth ? "" : "container mx-auto px-4 sm:px-6 lg:px-8",
          containerClassName
        )}>
          {children}
        </div>
      </section>
    )
  }
)
Section.displayName = "Section"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  centered?: boolean;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, centered = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mb-12",
          centered && "text-center",
          className
        )}
        {...props}
      />
    )
  }
)
SectionHeader.displayName = "SectionHeader"

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  gradient?: boolean;
}

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, gradient = false, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-3xl md:text-4xl font-bold mb-4",
          gradient && "bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-teal",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
SectionTitle.displayName = "SectionTitle"

interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const SectionDescription = React.forwardRef<HTMLParagraphElement, SectionDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-lg text-gray-600 max-w-3xl",
          className
        )}
        {...props}
      />
    )
  }
)
SectionDescription.displayName = "SectionDescription"

interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SectionContent = React.forwardRef<HTMLDivElement, SectionContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        {...props}
      />
    )
  }
)
SectionContent.displayName = "SectionContent"

export { 
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
}

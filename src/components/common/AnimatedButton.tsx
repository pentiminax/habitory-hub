
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    variant = "primary", 
    size = "default", 
    iconLeft, 
    iconRight, 
    ...props 
  }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variantStyles = {
      primary: "bg-primary text-primary-foreground shadow hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 active:shadow-md",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    };
    
    const sizeStyles = {
      default: "h-10 px-5 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-8 text-lg",
      icon: "h-10 w-10"
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        <span className="relative">
          {children}
          {variant === "primary" && (
            <span className="absolute inset-0 w-full h-full flex justify-center">
              <span className="h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            </span>
          )}
        </span>
        {iconRight && <span className="ml-2 transition-transform group-hover:translate-x-0.5">{iconRight}</span>}
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;

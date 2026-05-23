import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[#2A2D34] bg-transparent hover:bg-[#1E2127] text-[#F5F6F7]",
        secondary: "bg-[#1E2127] text-[#F5F6F7] hover:bg-[#2A2D34]",
        ghost: "hover:bg-[#1E2127] text-[#F5F6F7]",
        marketing: "bg-[#FF5A1F] text-white hover:bg-[#E04E15]",
        scout: "bg-[#1A2332] text-white hover:bg-[#2A3A4F]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

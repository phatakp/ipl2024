import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-over text-sm ring-offset-background transition ease-in-out duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground opacity-95 hover:opacity-100 shadow-md shadow-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground opacity-90 hover:opacity-100 shadow-secondary shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-darkblue hover:text-primary hover:underline hover:underline-offset-4 font-over capitalize tracking-normal",
        btnlink: "text-secondary-foreground hover:text-darkblue",
        GT: "bg-[#0e1a31] text-sky-400",
        MI: "bg-[#143266] text-yellow-400",
        CSK: "bg-[#ffcb05] text-blue-700",
        DC: "bg-[#01184a] text-red-500",
        KKR: "bg-[#281f4a] text-yellow-400",
        LSG: "bg-[#0349bc] text-gray-200",
        PBKS: "bg-[#d71920] text-gray-200",
        RR: "bg-[#052856] text-pink-400",
        RCB: "bg-[#581e21] text-yellow-400",
        SRH: "bg-[#f26522] text-red-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        btnlink: "py-1",
        team: "h-16 w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      icon,
      asChild = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "group")}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            {children}
            <span className="hidden group-hover:flex">{icon}</span>
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

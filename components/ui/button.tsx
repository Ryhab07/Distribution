import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        login: "border-2 border-[#fab516] rounded-md text-black hover:text-white hover:bg-[#fab516]",
        logout: "border-2 border-[#F40000] rounded-md text-black hover:text-white hover:bg-[#F40000]",
        loginMobile: "border-2 border-[#fab516] rounded-md text-black bg-white",
        logoutMobile: "border-2 border-[#F40000] rounded-md text-black bg-white",
        normalButton: "text-white bg-[#fab516] rounded-md hover:bg-[#00BF59]",
        normalBleuButton: "text-[#255D74] bg-white border border-[#255D74] rounded-md hover:bg-[#255D74] hover:text-white",
        newAuth: "bg-[#255D74] rounded-lg font-bold flex items-center text-white",
        pieceBtn: "rounded-md bg-transparent border-[#255D74] border w-full text-[#255D74]",
        pieceBtnDelete: "rounded-md bg-transparent border-red-500 border w-full text-red-500"

      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        xsm: "h-8 rounded-lg px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

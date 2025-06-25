import cn from "@/utils/cn";
import React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "button relative min-w-fit flex items-center justify-center gap-[0.8em] select-none transition-colors outline-none overflow-hidden text-white rounded-[0.6em] bg-primary border border-primary font-semibold p-[0.7em_2em] text-[1.6rem] whitespace-nowrap",
        "after:content-[''] after:w-full after:h-full after:bg-[rgba(0,0,0,0.1)] after:absolute after:top-0 after:left-0 after:transition after:opacity-0 cursor-pointer hover:after:opacity-[100%]",
        "disabled:opacity-50 disabled:pointer-events-none disable:cursor-not-allowed cursor",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;

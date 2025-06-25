import React, { forwardRef, InputHTMLAttributes } from "react";
import cn from "@/utils/cn";
import theme from "@/theme";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassName?: string;
  errorMessage?: string;
  required?: boolean;
}

const InputEmail = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, inputClassName, errorMessage, required, ...otherProps } =
    props;
  return (
    <div className={cn("input-email relative", className)}>
      {/* Input */}
      <input
        type="email"
        ref={ref}
        className={cn(
          theme.inputCommonStyling,
          inputClassName,
          errorMessage && "invalid"
        )}
        {...otherProps}
      />

      {/* Required Tag */}
      {required && (
        <span className="required absolute top-[1px] right-[0.5rem] text-error">
          *
        </span>
      )}

      {/* Errors  */}
      {errorMessage && (
        <div className="error text-error text-[1.1rem] mt-[0.5rem] ml-[0.8rem]">
          {errorMessage}
        </div>
      )}
    </div>
  );
});

InputEmail.displayName = "InputEmail";

export default InputEmail;

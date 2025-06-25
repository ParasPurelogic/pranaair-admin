import React, { forwardRef, InputHTMLAttributes } from "react";
import cn from "@/utils/cn";
import theme from "@/theme";

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  inputClassName?: string;
  errorMessage?: string;
  required?: boolean;
}

const InputTextarea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { className, inputClassName, errorMessage, required, ...otherProps } =
    props;
  return (
    <div className={cn("input-text relative", className)}>
      {/* Input */}
      <textarea
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

InputTextarea.displayName = "InputTextarea";

export default InputTextarea;

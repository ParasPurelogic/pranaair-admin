import React, { forwardRef, InputHTMLAttributes } from "react";
import cn from "@/utils/cn";
import theme from "@/theme";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassName?: string;
  labelText?: string;
}

const InputRadio = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, inputClassName, labelText, ...otherProps } = props;

  return (
    <label
      className={cn(
        "input-toggle relative inline-flex items-center cursor-pointer gap-[0.8rem] text-[1.7rem]",
        className
      )}
    >
      {/* Input */}
      <input
        type="checkbox"
        value=""
        ref={ref}
        className={cn(
          theme.inputCommonStyling,
          "w-fit sr-only peer",
          inputClassName
        )}
        {...otherProps}
      />
      <div className="relative peer w-[2.3em] h-[1.15em] bg-[#949FA6] rounded-full after:content-[''] after:absolute after:bg-white after:rounded-full after:transition-all after:h-[80%] after:aspect-square after:left-[0.1em] after:top-2/4 after:-translate-y-[52%] peer-checked:after:right-[0.1em] peer-checked:after:left-[auto]  peer-checked:bg-primary"></div>

      {/* Label */}
      {labelText && <span className="font-semibold">{labelText}</span>}
    </label>
  );
});

InputRadio.displayName = "InputToggle";

export default InputRadio;

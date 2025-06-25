"use client";

import theme from "@/theme";
import cn from "@/utils/cn";
import debouncer from "@/utility/debouncer";
import { useCallback } from "react";

type Props = {
  className?: string;
  onSearch?: (term: string) => void;
  placeholder?: string;
  defaultText?: string;
  onClear?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  disabled?: boolean;
};

const SearchBar = (props: Props) => {
  // Handle Search
  const handleSearch = useCallback((term: string) => {
    // Run props.onSearch
    if (props.onSearch) props.onSearch(term?.toLowerCase());

    // eslint-disable-next-line
  }, []);

  // Debounced Search
  // eslint-disable-next-line
  const debouncedSearch = useCallback(
    debouncer((term: string) => handleSearch(term), 500),
    []
  );

  // Return JSX
  return (
    <div
      className={cn(
        `search-bar w-full p-[1em] flex gap-[0.6em] items-center border border-para/20 rounded-[0.7em] text-para text-[1.2rem] bg-white focus-within:shadow-[0_0_0_2px_var(--color-primary)] focus-within:border-primary`,
        props.className
      )}
    >
      {/* Icon */}
      <i className="icon aspect-square min-w-[1.7em] max-w-[1.7em]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" fill="none">
          <g opacity="0.7">
            <path
              d="M9.125 8.84375L11.8336 11.5262"
              stroke="currentColor"
              strokeWidth="1.21829"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 5.39535C1 7.93501 3.07889 9.99383 5.64334 9.99383C6.92776 9.99383 8.09046 9.47734 8.93106 8.64264C9.76879 7.81085 10.2867 6.663 10.2867 5.39535C10.2867 2.85568 8.20778 0.796875 5.64334 0.796875C3.07889 0.796875 1 2.85568 1 5.39535Z"
              stroke="currentColor"
              strokeWidth="1.21829"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </i>
      {/* Input */}
      <input
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        type="search"
        className={cn(
          theme.inputCommonStyling,
          "leading-[1] !bg-transparent !border-0 !p-0",
          "focus-within:shadow-[unset]"
        )}
        placeholder={props.placeholder ?? "Search here"}
        defaultValue={props.defaultText ?? ""}
        onChange={(e) => debouncedSearch(e.target.value)}
        ref={props.inputRef}
      />
    </div>
  );
};

export default SearchBar;

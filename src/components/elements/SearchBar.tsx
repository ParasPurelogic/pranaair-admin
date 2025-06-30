"use client";

import theme from "@/theme";
import cn from "@/utils/cn";
import debouncer from "@/utils/debouncer";
import { useCallback } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

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
        `search-bar w-full p-[0.1em_0.6em] gap-[0.4em] flex items-center border border-para/20 rounded-[0.5em] text-para text-[1rem] bg-white focus-within:shadow-[0_0_0_2px_var(--color-primary)] focus-within:border-primary`,
        props.className
      )}
    >
      <Search className="w-[1em]" />
      <Input
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        type="search"
        className="!bg-transparent !border-none focus-visible:!border-ring focus-visible:!ring-ring/0 focus-visible:!ring-[0px] !p-0"
        placeholder={props.placeholder ?? "Search here"}
        defaultValue={props.defaultText ?? ""}
        onChange={(e) => debouncedSearch(e.target.value)}
        ref={props.inputRef}
      />
    </div>
  );
};

export default SearchBar;

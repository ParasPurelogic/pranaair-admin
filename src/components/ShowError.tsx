"use client";

import cn from "@/utils/cn";

type Props = {
  className?: string;
  message?: string;
  hideRefreshBtn?: boolean;
  refreshBtnText?: string;
  refreshCallback?: () => void;
};

const ShowError = (props: Props) => {
  return (
    <div
      aria-label="Error Message"
      className={cn(
        "data-fetching-error overflow-hidden py-[1rem] px-[1.3rem] rounded-[1.5rem] flex flex-col items-center justify-center text-center w-full border border-[rgba(249,109,109,0.3)] text-[rgb(249,109,109)] bg-[rgba(249,109,109,0.1)]",
        props.className
      )}
    >
      <span>
        {props.message
          ? props.message
          : "Unexpected Error. Please try again later."}
      </span>
      {!props.hideRefreshBtn && (
        <span
          onClick={() => {
            // if props.refreshCallback
            if (props.refreshCallback) {
              props.refreshCallback();
            } else {
              window?.location?.reload();
            }
          }}
          className="retry underline text-[1.4rem] cursor-pointer"
        >
          {props.refreshBtnText ?? "Reload page?"}
        </span>
      )}
    </div>
  );
};

export default ShowError;

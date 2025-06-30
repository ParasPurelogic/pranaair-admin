import cn from "@/utils/cn";

type Props = {
  className?: string;
  fullScreen?: boolean;
};

const ShowLoader = (props: Props) => {
  return (
    <div
      aria-label="Please wait... Loading"
      className={cn(
        "default-loader h-full w-full flex items-center justify-center cursor-wait",
        props.fullScreen &&
          `bg-transparent fixed z-[9999999999999] top-0 left-0 backdrop-blur-[10px]`,
        props.className
      )}
    >
      {/* <IconLoader className="text-[4rem] text-para" /> */}
    </div>
  );
};

export default ShowLoader;

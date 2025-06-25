import cn from "@/utils/cn";

type Props = {
  className?: string;
  message: string;
};

const ShowInfo = (props: Props) => {
  return (
    <div
      className={cn(
        "data-fetching-error py-[1rem] px-[1.3rem] rounded-[1.5rem] flex items-center justify-center text-center w-full border bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-[rgb(245,158,11)]",
        props.className
      )}
    >
      {props.message ? props.message : "Informer"}
    </div>
  );
};

export default ShowInfo;

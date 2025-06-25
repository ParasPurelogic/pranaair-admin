import cn from "@/utils/cn";

type Props = {
  className?: string;
};

const IconLoader = (props: Props) => {
  return (
    <div
      className={cn(
        "spinner relative inline-block text-[2.5rem] w-[1em] h-[1em] aspect-square text-white",
        props.className
      )}
    >
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
      <div className="spinner-blade" />
    </div>
  );
};

export default IconLoader;

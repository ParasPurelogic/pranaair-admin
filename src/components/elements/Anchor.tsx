interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
}

const Anchor = (props: AnchorProps) => {
  return (
    <a className={`anchor ${props.className}`} {...props} href={props.href}>
      {props.children}
    </a>
  );
};

export default Anchor;

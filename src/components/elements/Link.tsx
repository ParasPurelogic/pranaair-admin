import NextLink from "next/link";

const Link = (props: React.ComponentProps<typeof NextLink>) => {
  return (
    <NextLink {...props} prefetch={false}>
      {props.children}
    </NextLink>
  );
};

export default Link;

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/test/short",
      permanent: false,
    },
  };
}

export default function GeneralShortRedirect() {
  return null;
}

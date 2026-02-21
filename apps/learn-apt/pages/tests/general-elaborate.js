export function getServerSideProps() {
  return {
    redirect: {
      destination: "/test/elaborate",
      permanent: false,
    },
  };
}

export default function GeneralElaborateRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/test/quick-fire",
      permanent: false,
    },
  };
}

export default function QuickFireRedirect() {
  return null;
}

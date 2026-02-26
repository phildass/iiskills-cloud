// Legacy lesson route — redirects to the new /modules/[moduleId]/lesson/[lessonId] structure.
// This file is retained to avoid 404s from any old inbound links.

export async function getStaticPaths() {
  return { paths: [], fallback: false };
}

export async function getStaticProps() {
  return { props: {} };
}

export default function LegacyLessonRedirect() {
  return null;
}

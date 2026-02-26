// Legacy lesson route — redirects to the new /modules/[moduleId]/lesson/[lessonId] structure.
// This file is retained to avoid 404s on old inbound links.

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LegacyLessonRedirect() {
  const router = useRouter();
  const { moduleId } = router.query;

  useEffect(() => {
    if (moduleId) {
      router.replace(`/modules/${moduleId}/lesson/1`);
    }
  }, [moduleId, router]);

  return null;
}

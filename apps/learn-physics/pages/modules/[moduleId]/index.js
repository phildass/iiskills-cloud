import path from "path";
import { createLoader } from "@iiskills/content-loader";
import Link from "next/link";
import Head from "next/head";

export async function getStaticPaths() {
  const paths = [];
  for (let moduleId = 1; moduleId <= 10; moduleId++) {
    paths.push({ params: { moduleId: String(moduleId) } });
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { moduleId } = params;
  const contentRoot = path.resolve(process.cwd(), "../../content");
  const loader = createLoader(contentRoot);
  const course = loader.getCourse("learn-physics");
  const module = course ? course.modules.find((m) => m.id === Number(moduleId)) : null;
  return { props: { module: module || null, moduleId } };
}

export default function ModulePage({ module, moduleId }) {
  const lessons = Array.from({ length: 10 }, (_, i) => i + 1);

  if (!module) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold text-red-700">Module not found</h1>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{module.title} - Learn Physics</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Course
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
          <p className="text-gray-600 mb-8">Module {moduleId}</p>

          <h2 className="text-xl font-semibold mb-4">Lessons</h2>
          <div className="grid gap-3">
            {lessons.map((lessonId) => (
              <Link
                key={lessonId}
                href={`/modules/${moduleId}/lesson/${lessonId}`}
                className="block border border-gray-200 rounded-lg p-4 bg-white hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <span className="font-medium">Lesson {lessonId}</span>
                {lessonId === 1 && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

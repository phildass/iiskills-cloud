import path from "path";
import { createLoader } from "@iiskills/content-loader";
import Link from "next/link";
import Head from "next/head";

export async function getStaticProps() {
  try {
    const contentRoot = path.resolve(process.cwd(), "../../content");
    const loader = createLoader(contentRoot);
    const course = loader.getCourse("learn-physics");
    return { props: { course: course || null } };
  } catch (err) {
    console.error("[learn-physics] getStaticProps error:", err.message);
    return { props: { course: null } };
  }
}

export default function PhysicsHome({ course }) {
  if (!course) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-gray-600">Course content unavailable.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{course.title}</title>
        <meta name="description" content={course.description} />
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{course.description}</p>

          <h2 className="text-2xl font-semibold mb-4">Modules</h2>
          <div className="grid gap-4">
            {course.modules.map((mod) => (
              <Link
                key={mod.id}
                href={`/modules/${mod.id}`}
                className="block border border-gray-200 rounded-lg p-5 bg-white hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900">{mod.title}</h3>
                {mod.level && <span className="text-sm text-blue-600 capitalize">{mod.level}</span>}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

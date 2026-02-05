import Link from 'next/link';

export default function ModuleCard({ module, preview = false }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl mr-4">
          {module.difficulty === 'Beginner' ? '🌱' : 
           module.difficulty === 'Intermediate' ? '🚀' : '⭐'}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
          module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {module.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3">{module.title}</h3>
      <p className="text-gray-600 mb-4">{module.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>📚 10 Lessons</span>
        <span>⏱️ ~3 hours</span>
      </div>

      {!preview && (
        <Link
          href={`/modules/${module.id}/lesson/1`}
          className="block text-center btn-primary"
        >
          Start Module
        </Link>
      )}

      {preview && (
        <div className="text-center text-sm text-gray-500">
          Module {module.order} of 10
        </div>
      )}
    </div>
  );
}

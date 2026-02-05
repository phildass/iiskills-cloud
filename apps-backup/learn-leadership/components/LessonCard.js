export default function LessonCard({ lesson, locked = false }) {
  return (
    <div className={`card ${locked ? 'opacity-50' : 'hover:shadow-lg'} transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2">{lesson.title}</h4>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span>⏱️ {lesson.duration_minutes} min</span>
            {lesson.is_free && <span className="text-green-600 font-semibold">Free</span>}
          </div>
        </div>

        <div>
          {locked ? (
            <span className="text-gray-400">🔒</span>
          ) : (
            <span className="text-green-500">✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

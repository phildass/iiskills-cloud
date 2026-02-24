export default function NewsList({ stories, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading news...</p>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">No news articles found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stories.map((story, index) => (
        <div key={index} className="card hover:shadow-lg transition-shadow">
          {story.image && (
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <div className="text-sm text-gray-500 mb-2">
            {story.source} • {new Date(story.publishedAt).toLocaleDateString()}
          </div>

          <h3 className="text-lg font-semibold mb-3 line-clamp-2">
            {story.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {story.description}
          </p>

          {story.url && story.url !== '#' && (
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Read more →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

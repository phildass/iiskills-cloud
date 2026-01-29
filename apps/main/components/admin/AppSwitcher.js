export default function AppSwitcher({ apps, selectedApp, onAppChange }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Applications
      </h2>
      <div className="space-y-1">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppChange(app)}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              selectedApp?.id === app.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{app.icon || '📁'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {app.displayName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {app.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

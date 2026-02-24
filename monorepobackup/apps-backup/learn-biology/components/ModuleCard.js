"use client";

export default function ModuleCard({ module, onClick }) {
  const getTierColor = (tier) => {
    switch (tier) {
      case "Basic":
        return "bg-green-100 text-green-800 border-green-300";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-green-600">
              Module {module.id}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getTierColor(
                module.tier
              )}`}
            >
              {module.tier}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {module.title}
          </h3>
          <p className="text-gray-600 text-sm">{module.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          {module.lessons?.length || 0} Lessons
        </span>
        <span className="text-green-600 font-semibold">View Module →</span>
      </div>
    </div>
  );
}

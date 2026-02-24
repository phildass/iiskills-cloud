import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProgress } from "../../contexts/UserProgressContext";

// Mock module/lesson data for search
const SEARCH_DATA = [
  { id: 1, title: "Introduction to AI", app: "learn-ai", type: "module" },
  { id: 2, title: "Machine Learning Basics", app: "learn-ai", type: "lesson" },
  { id: 3, title: "Leadership Principles", app: "learn-management", type: "module" },
  { id: 4, title: "SWOT Analysis", app: "learn-management", type: "lesson" },
  { id: 5, title: "Python Fundamentals", app: "learn-developer", type: "module" },
  { id: 6, title: "HTML & CSS", app: "learn-developer", type: "lesson" },
  { id: 7, title: "Media Relations", app: "learn-pr", type: "module" },
  { id: 8, title: "Crisis Communication", app: "learn-pr", type: "lesson" },
  { id: 9, title: "Newton's Laws", app: "learn-physics", type: "lesson" },
  { id: 10, title: "Thermodynamics", app: "learn-physics", type: "module" },
  { id: 11, title: "Entropy", app: "learn-physics", type: "lesson" },
  { id: 12, title: "Algebra Basics", app: "learn-math", type: "module" },
  { id: 13, title: "Statistics", app: "learn-math", type: "lesson" },
  { id: 14, title: "Logical Reasoning", app: "learn-apt", type: "module" },
  { id: 15, title: "Quantitative Aptitude", app: "learn-apt", type: "lesson" },
  { id: 16, title: "Indian States", app: "learn-geography", type: "module" },
  { id: 17, title: "Suez Canal", app: "learn-geography", type: "lesson" },
  { id: 18, title: "Chemical Bonds", app: "learn-chemistry", type: "module" },
  { id: 19, title: "Water Properties", app: "learn-chemistry", type: "lesson" },
  // MOVED TO apps-backup as per cleanup requirements
  // { id: 20, title: "UPSC Preparation", app: "learn-govt-jobs", type: "module" },
];

export default function MagicSearchBar() {
  const { apps } = useUserProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Keyboard shortcut: Cmd/Ctrl + K to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fuzzy search implementation
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const fuzzyResults = SEARCH_DATA.filter((item) => {
      const titleLower = item.title.toLowerCase();
      const appName = apps.find((a) => a.id === item.app)?.name.toLowerCase() || "";
      
      // Simple fuzzy matching: check if all characters appear in order
      let titleIndex = 0;
      let appIndex = 0;
      for (let char of query) {
        const foundInTitle = titleLower.indexOf(char, titleIndex);
        const foundInApp = appName.indexOf(char, appIndex);
        
        if (foundInTitle !== -1) {
          titleIndex = foundInTitle + 1;
          continue;
        }
        if (foundInApp !== -1) {
          appIndex = foundInApp + 1;
          continue;
        }
        return false;
      }
      return true;
    });

    setResults(fuzzyResults.slice(0, 8)); // Limit to 8 results
  }, [searchQuery, apps]);

  const handleResultClick = (result) => {
    // In a real app, this would navigate to the module/lesson
    console.log("Navigate to:", result);
    setIsOpen(false);
    setSearchQuery("");
    // You could implement smooth scroll to Bento grid tile here
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 bg-white text-charcoal px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all border-2 border-primary flex items-center gap-2 group"
      >
        <span className="text-xl">🔍</span>
        <span className="font-semibold">Search Skills</span>
        <kbd className="hidden sm:inline-block ml-2 px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300">
          ⌘K
        </kbd>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for skills, topics, modules..."
                    className="flex-1 text-lg outline-none"
                    aria-label="Search for skills and topics"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ESC
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => {
                      const app = apps.find((a) => a.id === result.app);
                      return (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                          onClick={() => handleResultClick(result)}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ backgroundColor: app?.color || "#0052CC" }}
                          >
                            {app?.name.charAt(6) || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-charcoal truncate">{result.title}</p>
                            <p className="text-sm text-gray-600">
                              {app?.name} • {result.type}
                            </p>
                          </div>
                          <span className="text-gray-400">→</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : searchQuery.trim() !== "" ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-lg mb-2">No results found</p>
                    <p className="text-sm">Try searching for "Leadership", "Python", or "Physics"</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-lg mb-2">Start typing to search</p>
                    <p className="text-sm">
                      Search across all apps, modules, and lessons
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300">Enter</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white rounded border border-gray-300">ESC</kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

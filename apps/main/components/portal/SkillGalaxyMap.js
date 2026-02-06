import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useUserProgress } from "../../contexts/UserProgressContext";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function SkillGalaxyMap() {
  const { apps } = useUserProgress();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedApp, setSelectedApp] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const graphRef = useRef();

  useEffect(() => {
    // Build graph data from apps
    const nodes = apps.map((app) => ({
      id: app.id,
      name: app.name.replace("Learn ", ""),
      color: app.color,
      progress: app.progress,
      val: 20 + ((app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3) / 5,
    }));

    const links = [];
    apps.forEach((app) => {
      app.connections.forEach((targetId) => {
        if (apps.find((a) => a.id === targetId)) {
          links.push({
            source: app.id,
            target: targetId,
          });
        }
      });
    });

    setGraphData({ nodes, links });
  }, [apps]);

  const handleNodeClick = useCallback(
    (node) => {
      const app = apps.find((a) => a.id === node.id);
      setSelectedApp(app);
    },
    [apps]
  );

  const closeModal = () => {
    setSelectedApp(null);
  };

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-xl overflow-hidden ${
        isExpanded ? "h-[600px]" : "h-[400px]"
      } transition-all duration-300`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-2xl font-bold text-primary mb-1">Skill Galaxy Map</h2>
        <p className="text-sm text-charcoal">Explore connections between learning apps</p>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          aria-label={isExpanded ? "Collapse map" : "Expand map"}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="w-full h-full pt-16">
        {typeof window !== "undefined" && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={(node) => node.color}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
              ctx.fill();
              ctx.strokeStyle = "#fff";
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.fillStyle = "#fff";
              ctx.fillText(label, node.x, node.y);
            }}
            linkColor={() => "#C77DDB"}
            linkWidth={2}
            linkOpacity={0.4}
            onNodeClick={handleNodeClick}
            enableNodeDrag={false}
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        )}
      </div>

      {/* Modal for selected app */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-primary">{selectedApp.name}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-charcoal">Basics</span>
                    <span className="text-sm font-bold text-accent">{selectedApp.progress.basics}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedApp.progress.basics}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-green-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-charcoal">Intermediate</span>
                    <span className="text-sm font-bold text-accent">{selectedApp.progress.intermediate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedApp.progress.intermediate}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-yellow-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-charcoal">Advanced</span>
                    <span className="text-sm font-bold text-accent">{selectedApp.progress.advanced}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedApp.progress.advanced}%` }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-red-500 h-3 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`/${selectedApp.id}`}
                  className="block text-center bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Start Learning →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

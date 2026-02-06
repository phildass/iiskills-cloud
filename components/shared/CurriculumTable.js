/**
 * CurriculumTable Component
 * 
 * Displays the structured curriculum table showing:
 * Level | Modules (What) | Lessons (How) | Tests (Proof)
 * 
 * Used on landing pages and curriculum pages
 */

import { useState } from 'react';

export default function CurriculumTable({ 
  subject, 
  basicModules = [], 
  intermediateModules = [], 
  advancedModules = [] 
}) {
  const [selectedLevel, setSelectedLevel] = useState('basic');

  const getLevelModules = (level) => {
    switch (level) {
      case 'basic':
        return basicModules;
      case 'intermediate':
        return intermediateModules;
      case 'advanced':
        return advancedModules;
      default:
        return [];
    }
  };

  const modules = getLevelModules(selectedLevel);

  const getLevelInfo = (level) => {
    const info = {
      basic: {
        title: 'Basic',
        subtitle: 'Literacy',
        description: 'Build foundational understanding',
        color: 'green',
        icon: '🌱'
      },
      intermediate: {
        title: 'Intermediate',
        subtitle: 'Application',
        description: 'Apply concepts to solve problems',
        color: 'blue',
        icon: '⚡'
      },
      advanced: {
        title: 'Advanced',
        subtitle: 'Specialization',
        description: 'Master advanced topics',
        color: 'purple',
        icon: '🚀'
      }
    };
    return info[level];
  };

  const levelInfo = getLevelInfo(selectedLevel);

  return (
    <div className="space-y-8">
      {/* Level Selector */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {['basic', 'intermediate', 'advanced'].map((level) => {
          const info = getLevelInfo(level);
          const isActive = selectedLevel === level;
          
          return (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`flex-1 p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                isActive
                  ? `bg-${info.color}-50 border-${info.color}-500 shadow-lg`
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="text-4xl mb-2">{info.icon}</div>
              <div className={`text-xl font-bold ${isActive ? `text-${info.color}-900` : 'text-gray-900'}`}>
                {info.title}
              </div>
              <div className={`text-sm ${isActive ? `text-${info.color}-700` : 'text-gray-600'}`}>
                {info.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Level Header */}
      <div className={`card bg-gradient-to-r from-${levelInfo.color}-50 to-${levelInfo.color}-100 border-l-4 border-${levelInfo.color}-500`}>
        <div className="flex items-center space-x-4">
          <div className="text-5xl">{levelInfo.icon}</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {levelInfo.title} Level
            </h2>
            <p className="text-lg text-gray-700 mt-1">
              {levelInfo.description}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {modules.length} modules • {modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)} lessons
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
          <thead className={`bg-${levelInfo.color}-500 text-white`}>
            <tr>
              <th className="p-4 text-left font-semibold">Module (What)</th>
              <th className="p-4 text-left font-semibold">Lessons (How)</th>
              <th className="p-4 text-left font-semibold">Tests (Proof)</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module, idx) => (
              <tr
                key={module.id}
                className={`border-t border-gray-200 hover:bg-${levelInfo.color}-50 transition-colors`}
              >
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{module.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{module.description}</div>
                </td>
                <td className="p-4">
                  {module.lessons && module.lessons.length > 0 ? (
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div key={lesson.id} className="text-sm text-gray-700">
                          {lessonIdx + 1}. {lesson.title}
                        </div>
                      ))}
                      {module.lessons.length === 0 && (
                        <div className="text-sm text-gray-400 italic">
                          Coming soon
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      {module.lessons === undefined ? 'Coming soon' : `${module.lessons?.length || 10} lessons planned`}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {module.lessons && module.lessons.length > 0
                        ? `${module.lessons.length} quizzes`
                        : 'Quiz after each lesson'}
                    </span>
                    <span className="text-lg">✅</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">{modules.length}</div>
          <div className="text-sm text-gray-600 mt-1">Modules</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">
            {modules.reduce((sum, m) => sum + (m.lessons?.length || 10), 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Lessons</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">
            {modules.reduce((sum, m) => sum + (m.lessons?.length || 10), 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Quizzes</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Subject Comparison Table
 * 
 * Shows module counts across all 4 subjects
 */
export function SubjectComparisonTable() {
  const subjects = [
    { name: 'Physics', basic: 6, intermediate: 8, advanced: 6, icon: '⚛️' },
    { name: 'Math', basic: 7, intermediate: 9, advanced: 5, icon: '📐' },
    { name: 'Geography', basic: 5, intermediate: 7, advanced: 5, icon: '🌍' },
    { name: 'Chemistry', basic: 6, intermediate: 8, advanced: 6, icon: '🧪' }
  ];

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Curriculum Overview Across Subjects
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold">Subject</th>
              <th className="p-4 text-center font-semibold">Basic Modules</th>
              <th className="p-4 text-center font-semibold">Intermediate Modules</th>
              <th className="p-4 text-center font-semibold">Advanced Modules</th>
              <th className="p-4 text-center font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, idx) => (
              <tr
                key={subject.name}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{subject.icon}</span>
                    <span className="font-semibold text-gray-900">{subject.name}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    {subject.basic}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                    {subject.intermediate}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                    {subject.advanced}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="font-bold text-gray-900">
                    {subject.basic + subject.intermediate + subject.advanced}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

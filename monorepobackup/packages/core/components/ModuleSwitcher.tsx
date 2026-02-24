/**
 * ModuleSwitcher Component
 * 
 * A smart component that renders different UI layouts based on the module_type.
 * Uses a switch statement to determine which component to render.
 */

import React from 'react';
import { Module, ContentType } from '../types/module.types';

/**
 * Props for individual module renderers
 */
export interface ModuleRendererProps<T extends ContentType = ContentType> {
  module: Module<T>;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Props for ModuleSwitcher
 */
export interface ModuleSwitcherProps {
  module: Module;
  
  // Custom renderers for each content type
  renderLesson?: React.ComponentType<ModuleRendererProps<'lesson'>>;
  renderTest?: React.ComponentType<ModuleRendererProps<'test'>>;
  renderJobPosting?: React.ComponentType<ModuleRendererProps<'job_posting'>>;
  renderQuiz?: React.ComponentType<ModuleRendererProps>;
  renderArticle?: React.ComponentType<ModuleRendererProps>;
  renderVideo?: React.ComponentType<ModuleRendererProps>;
  renderCustom?: React.ComponentType<ModuleRendererProps>;
  
  // Fallback renderer
  renderFallback?: React.ComponentType<{ module: Module }>;
  
  // Callbacks
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Default renderers for each content type
 */
const DefaultLessonRenderer: React.FC<ModuleRendererProps<'lesson'>> = ({ module }) => {
  const content = module.content;
  
  return (
    <div className="lesson-container space-y-6">
      <div className="lesson-header">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{module.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{content.description}</p>
        
        {content.objectives && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Learning Objectives</h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {content.objectives.map((objective, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{objective}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {content.sections && (
        <div className="lesson-content space-y-4">
          {content.sections.map((section) => (
            <div key={section.id} className="section p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
              <div className="mt-2 text-gray-700 dark:text-gray-300">{section.content}</div>
            </div>
          ))}
        </div>
      )}
      
      {content.materials && (
        <div className="materials mt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Materials</h2>
          <div className="mt-2 space-y-2">
            {content.materials.map((material, index) => (
              <a
                key={index}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-blue-50 dark:bg-blue-900 rounded hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <span className="font-medium text-blue-900 dark:text-blue-100">{material.title}</span>
                <span className="ml-2 text-sm text-blue-700 dark:text-blue-300">({material.type})</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultTestRenderer: React.FC<ModuleRendererProps<'test'>> = ({ module }) => {
  const content = module.content;
  
  return (
    <div className="test-container space-y-6">
      <div className="test-header">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{module.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{content.description}</p>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat p-3 bg-blue-50 dark:bg-blue-900 rounded">
            <div className="text-sm text-blue-700 dark:text-blue-300">Duration</div>
            <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">{content.duration} min</div>
          </div>
          <div className="stat p-3 bg-green-50 dark:bg-green-900 rounded">
            <div className="text-sm text-green-700 dark:text-green-300">Questions</div>
            <div className="text-lg font-semibold text-green-900 dark:text-green-100">{content.totalQuestions}</div>
          </div>
          <div className="stat p-3 bg-purple-50 dark:bg-purple-900 rounded">
            <div className="text-sm text-purple-700 dark:text-purple-300">Mode</div>
            <div className="text-lg font-semibold text-purple-900 dark:text-purple-100">{content.testMode}</div>
          </div>
          {content.passingScore && (
            <div className="stat p-3 bg-yellow-50 dark:bg-yellow-900 rounded">
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Passing Score</div>
              <div className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">{content.passingScore}%</div>
            </div>
          )}
        </div>
      </div>
      
      {content.instructions && (
        <div className="instructions">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Instructions</h2>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {content.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{instruction}</li>
            ))}
          </ul>
        </div>
      )}
      
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Start Test
      </button>
    </div>
  );
};

const DefaultJobPostingRenderer: React.FC<ModuleRendererProps<'job_posting'>> = ({ module }) => {
  const content = module.content;
  
  return (
    <div className="job-posting-container space-y-6">
      <div className="job-header">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{module.title}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
          <span className="flex items-center">
            <span className="font-semibold mr-1">Company:</span> {content.company}
          </span>
          <span className="flex items-center">
            <span className="font-semibold mr-1">Location:</span> {content.location}
          </span>
          <span className="flex items-center">
            <span className="font-semibold mr-1">Type:</span> {content.employmentType}
          </span>
        </div>
        
        {content.salary && (
          <div className="mt-2 text-lg font-semibold text-green-600 dark:text-green-400">
            {content.salary.currency} {content.salary.min.toLocaleString()} - {content.salary.max.toLocaleString()}
          </div>
        )}
      </div>
      
      <div className="job-description">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Description</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{content.description}</p>
      </div>
      
      {content.requirements && (
        <div className="job-requirements">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Requirements</h2>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {content.requirements.map((req, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
      )}
      
      {content.responsibilities && (
        <div className="job-responsibilities">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Responsibilities</h2>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {content.responsibilities.map((resp, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{resp}</li>
            ))}
          </ul>
        </div>
      )}
      
      {content.benefits && (
        <div className="job-benefits">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Benefits</h2>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {content.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{benefit}</li>
            ))}
          </ul>
        </div>
      )}
      
      {content.applicationUrl && (
        <a
          href={content.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </a>
      )}
      
      {content.applicationDeadline && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Application Deadline: {new Date(content.applicationDeadline).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const DefaultFallbackRenderer: React.FC<{ module: Module }> = ({ module }) => {
  return (
    <div className="fallback-container p-6 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">Unsupported Content Type</h2>
      <p className="mt-2 text-yellow-800 dark:text-yellow-200">
        No renderer available for content type: <code className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded">{module.content_type}</code>
      </p>
      <pre className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800 rounded overflow-auto">
        {JSON.stringify(module, null, 2)}
      </pre>
    </div>
  );
};

/**
 * ModuleSwitcher component
 * Renders different components based on module content_type
 */
export const ModuleSwitcher: React.FC<ModuleSwitcherProps> = ({
  module,
  renderLesson = DefaultLessonRenderer,
  renderTest = DefaultTestRenderer,
  renderJobPosting = DefaultJobPostingRenderer,
  renderQuiz,
  renderArticle,
  renderVideo,
  renderCustom,
  renderFallback = DefaultFallbackRenderer,
  onComplete,
  onError,
}) => {
  // Use switch statement to determine which component to render
  switch (module.content_type) {
    case 'lesson': {
      const LessonRenderer = renderLesson;
      return <LessonRenderer module={module as Module<'lesson'>} onComplete={onComplete} onError={onError} />;
    }
    
    case 'test': {
      const TestRenderer = renderTest;
      return <TestRenderer module={module as Module<'test'>} onComplete={onComplete} onError={onError} />;
    }
    
    case 'job_posting': {
      const JobPostingRenderer = renderJobPosting;
      return <JobPostingRenderer module={module as Module<'job_posting'>} onComplete={onComplete} onError={onError} />;
    }
    
    case 'quiz': {
      if (renderQuiz) {
        const QuizRenderer = renderQuiz;
        return <QuizRenderer module={module} onComplete={onComplete} onError={onError} />;
      }
      // Fallback to test renderer for quiz
      const TestRenderer = renderTest;
      return <TestRenderer module={module as Module<'test'>} onComplete={onComplete} onError={onError} />;
    }
    
    case 'article': {
      if (renderArticle) {
        const ArticleRenderer = renderArticle;
        return <ArticleRenderer module={module} onComplete={onComplete} onError={onError} />;
      }
      // Fallback to lesson renderer for article
      const LessonRenderer = renderLesson;
      return <LessonRenderer module={module as Module<'lesson'>} onComplete={onComplete} onError={onError} />;
    }
    
    case 'video': {
      if (renderVideo) {
        const VideoRenderer = renderVideo;
        return <VideoRenderer module={module} onComplete={onComplete} onError={onError} />;
      }
      break;
    }
    
    default: {
      // Try custom renderer first
      if (renderCustom) {
        const CustomRenderer = renderCustom;
        return <CustomRenderer module={module} onComplete={onComplete} onError={onError} />;
      }
    }
  }
  
  // Fallback renderer
  const FallbackRenderer = renderFallback;
  return <FallbackRenderer module={module} />;
};

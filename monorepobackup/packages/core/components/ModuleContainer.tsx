/**
 * ModuleContainer Component
 * 
 * A Higher-Order Component (HOC) that provides common functionality
 * for all module types. It handles loading states, error handling,
 * and delegates rendering to ModuleSwitcher.
 */

import React, { useState, useCallback } from 'react';
import { Module } from '../types/module.types';
import { ModuleSwitcher, ModuleSwitcherProps } from './ModuleSwitcher';

/**
 * Props for ModuleContainer
 */
export interface ModuleContainerProps extends Omit<ModuleSwitcherProps, 'module'> {
  module: Module | null;
  isLoading?: boolean;
  error?: Error | null;
  
  // Custom renderers for states
  renderLoading?: React.ComponentType;
  renderError?: React.ComponentType<{ error: Error; onRetry?: () => void }>;
  renderEmpty?: React.ComponentType;
  
  // Callbacks
  onRetry?: () => void;
  
  // Container customization
  className?: string;
  showMetadata?: boolean;
  showTags?: boolean;
}

/**
 * Default Loading Component
 */
const DefaultLoadingRenderer: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading module...</p>
      </div>
    </div>
  );
};

/**
 * Default Error Component
 */
const DefaultErrorRenderer: React.FC<{ error: Error; onRetry?: () => void }> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Module</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Default Empty Component
 */
const DefaultEmptyRenderer: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Module Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The requested module could not be found.</p>
      </div>
    </div>
  );
};

/**
 * Module Metadata Display
 */
const ModuleMetadata: React.FC<{ module: Module; showTags?: boolean }> = ({ module, showTags = true }) => {
  const { metadata } = module;
  
  return (
    <div className="module-metadata mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        {metadata.author && (
          <div className="flex items-center">
            <span className="font-semibold mr-1">Author:</span>
            <span>{metadata.author}</span>
          </div>
        )}
        
        {metadata.difficulty && (
          <div className="flex items-center">
            <span className="font-semibold mr-1">Difficulty:</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {metadata.difficulty}
            </span>
          </div>
        )}
        
        {metadata.estimatedDuration && (
          <div className="flex items-center">
            <span className="font-semibold mr-1">Duration:</span>
            <span>{metadata.estimatedDuration} minutes</span>
          </div>
        )}
        
        <div className="flex items-center">
          <span className="font-semibold mr-1">Updated:</span>
          <span>{new Date(metadata.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {showTags && metadata.tags && metadata.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {metadata.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * ModuleContainer HOC
 * Wraps module content with common functionality
 */
export const ModuleContainer: React.FC<ModuleContainerProps> = ({
  module,
  isLoading = false,
  error = null,
  renderLoading = DefaultLoadingRenderer,
  renderError = DefaultErrorRenderer,
  renderEmpty = DefaultEmptyRenderer,
  onRetry,
  onComplete,
  onError,
  className = '',
  showMetadata = true,
  showTags = true,
  ...switcherProps
}) => {
  const [internalError, setInternalError] = useState<Error | null>(null);
  
  /**
   * Handle errors from child components
   */
  const handleError = useCallback(
    (err: Error) => {
      setInternalError(err);
      if (onError) {
        onError(err);
      }
    },
    [onError]
  );
  
  /**
   * Handle completion
   */
  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);
  
  /**
   * Render loading state
   */
  if (isLoading) {
    const LoadingRenderer = renderLoading;
    return (
      <div className={`module-container ${className}`}>
        <LoadingRenderer />
      </div>
    );
  }
  
  /**
   * Render error state
   */
  const displayError = error || internalError;
  if (displayError) {
    const ErrorRenderer = renderError;
    return (
      <div className={`module-container ${className}`}>
        <ErrorRenderer error={displayError} onRetry={onRetry} />
      </div>
    );
  }
  
  /**
   * Render empty state
   */
  if (!module) {
    const EmptyRenderer = renderEmpty;
    return (
      <div className={`module-container ${className}`}>
        <EmptyRenderer />
      </div>
    );
  }
  
  /**
   * Render module content
   */
  return (
    <div className={`module-container ${className}`}>
      {showMetadata && <ModuleMetadata module={module} showTags={showTags} />}
      
      <ModuleSwitcher
        module={module}
        onComplete={handleComplete}
        onError={handleError}
        {...switcherProps}
      />
    </div>
  );
};

/**
 * Higher-Order Component factory
 * Creates a ModuleContainer with pre-configured props
 */
export function withModuleContainer<P extends object>(
  Component: React.ComponentType<P>,
  containerProps?: Partial<ModuleContainerProps>
) {
  return function ModuleContainerWrapper(props: P & ModuleContainerProps) {
    return (
      <ModuleContainer {...containerProps} {...props}>
        <Component {...(props as P)} />
      </ModuleContainer>
    );
  };
}

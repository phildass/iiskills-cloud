/**
 * Example Usage of @iiskills/core
 */

import React from 'react';
import {
  Module,
  ModuleContainer,
  useModuleData,
  useModule,
  ModuleRendererProps
} from '../index';

// Basic Module Display Example
export function BasicModuleExample({ moduleId }: { moduleId: string }) {
  const { module, isLoading, error, refetch } = useModule(moduleId);

  return (
    <div className="container mx-auto p-4">
      <ModuleContainer
        module={module}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}

// Module List Example
export function ModuleListExample() {
  const {
    modules,
    isLoading,
    hasMore,
    fetchMore,
  } = useModuleData({
    endpoint: '/api/modules',
    filters: {
      content_type: ['lesson', 'test'],
      status: ['published']
    },
    pageSize: 12,
    autoFetch: true
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Browse Modules</h1>

      {isLoading && <div>Loading modules...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold">{module.title}</h3>
            <span className="text-sm text-gray-600">{module.content_type}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button onClick={fetchMore} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Load More
        </button>
      )}
    </div>
  );
}

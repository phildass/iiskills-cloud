"use client";

import { useState, useEffect } from 'react';

export default function ContentEditor({ app, content, onSave, onCancel }) {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize form data from content
    if (content) {
      setFormData(content.data || {});
    }
  }, [content]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleArrayAdd = (fieldName) => {
    const currentArray = formData[fieldName] || [];
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...currentArray, ''],
    }));
  };

  const handleArrayChange = (fieldName, index, value) => {
    const currentArray = formData[fieldName] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newArray,
    }));
  };

  const handleArrayRemove = (fieldName, index) => {
    const currentArray = formData[fieldName] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newArray,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const method = content.isNew ? 'POST' : 'PUT';
      const body = content.isNew
        ? { source_app: app.id, data: formData }
        : { source_app: app.id, content_id: content.id, data: formData };

      const response = await fetch('/api/admin/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        onSave();
      } else {
        setError(data.error || 'Failed to save content');
      }
    } catch (err) {
      setError('An error occurred while saving');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/content?source_app=${app.id}&content_id=${content.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete content');
      }
    } catch (err) {
      setError('An error occurred while deleting');
      console.error('Delete error:', err);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.name === 'content' ? 12 : 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || 0)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'date':
        return (
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'array':
        const arrayValue = formData[field.name] || [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field.name, index, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove(field.name, index)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd(field.name)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition text-sm"
            >
              + Add {field.label}
            </button>
          </div>
        );

      case 'nested':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Nested editing coming soon. Currently stored as: {JSON.stringify(value)}
            </p>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {content.isNew ? 'Create New' : 'Edit'} {app.displayName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {content.isNew ? 'Fill in the details below' : `Editing: ${content.title}`}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back to List
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {app.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div>
            {!content.isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

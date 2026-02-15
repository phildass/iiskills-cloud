/**
 * JobCard Component
 * 
 * A comprehensive card component for displaying government job notifications
 * with AI-powered match scores, document checklists, and application timelines.
 * 
 * Features:
 * - AI match score with reasoning
 * - Document checklist
 * - Application timeline
 * - WhatsApp sharing
 * - Save/Apply actions
 * - Mobile-optimized
 * - Trust indicators (source domain, verification badges)
 */

import React, { useState } from 'react';
import type {
  JobCardProps,
  TimelineEvent,
  MatchScoreBadgeProps,
  TimelineProps,
  DocumentChecklistProps,
} from './JobCard.types';

/**
 * Match Score Badge Component
 * Displays AI match score with color coding
 */
const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  size = 'medium',
  showLabel = true,
}) => {
  // Color coding based on score
  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border-2 font-semibold ${getScoreColor(
        score
      )} ${sizeClasses[size]}`}
      title="AI-calculated match score based on your profile"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{score}% Match</span>
      {showLabel && (
        <span className="text-xs opacity-75 hidden sm:inline">
          (AI Score)
        </span>
      )}
    </div>
  );
};

/**
 * Timeline Component
 * Shows application process timeline with current status
 */
const Timeline: React.FC<TimelineProps> = ({ events, compact = false }) => {
  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'current':
        return '●';
      case 'upcoming':
        return '○';
      case 'expired':
        return '✕';
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'current':
        return 'text-blue-600 bg-blue-50';
      case 'upcoming':
        return 'text-gray-600 bg-gray-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className={`space-y-2 ${compact ? 'text-sm' : ''}`}>
      {events.map((event, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-2 rounded ${getStatusColor(
            event.status
          )}`}
        >
          <span className="font-bold text-lg">{getStatusIcon(event.status)}</span>
          <div className="flex-1">
            <div className="font-medium">{event.label}</div>
            <div className="text-xs opacity-75">
              {typeof event.date === 'string'
                ? event.date
                : event.date.toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Document Checklist Component
 * Shows required documents for application
 */
const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  compact = false,
}) => {
  return (
    <div className={`space-y-1 ${compact ? 'text-sm' : ''}`}>
      <h4 className="font-semibold mb-2">Required Documents:</h4>
      <ul className="space-y-1">
        {documents.map((doc, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">
              {doc.required ? '●' : '○'}
            </span>
            <span className={doc.required ? 'font-medium' : ''}>
              {doc.type}
              {!doc.required && (
                <span className="text-gray-500 text-xs ml-1">(Optional)</span>
              )}
            </span>
            {doc.url && (
              <a
                href={doc.url}
                className="text-blue-600 text-xs underline ml-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sample
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Main JobCard Component
 */
const JobCard: React.FC<JobCardProps> = ({
  job,
  showMatchScore = false,
  showDetailedMatch = false,
  showTimeline = true,
  compact = false,
  onSave,
  onApply,
  onShare,
  onClick,
  isAuthenticated = false,
  className = '',
}) => {
  const [showMatchDetails, setShowMatchDetails] = useState(showDetailedMatch);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  // Build timeline events
  const timelineEvents: TimelineEvent[] = [];
  
  if (job.applicationStartDate) {
    timelineEvents.push({
      label: 'Application Opens',
      date: job.applicationStartDate,
      status: new Date(job.applicationStartDate) < new Date() ? 'completed' : 'upcoming',
    });
  }
  
  if (job.applicationEndDate) {
    const endDate = new Date(job.applicationEndDate);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    timelineEvents.push({
      label: `Application Closes${daysLeft > 0 ? ` (${daysLeft} days left)` : ''}`,
      date: job.applicationEndDate,
      status: endDate < now ? 'expired' : endDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000 ? 'current' : 'upcoming',
    });
  }
  
  if (job.examDate) {
    timelineEvents.push({
      label: 'Exam Date',
      date: job.examDate,
      status: new Date(job.examDate) < new Date() ? 'completed' : 'upcoming',
    });
  }
  
  if (job.resultDate) {
    timelineEvents.push({
      label: 'Result Date',
      date: job.resultDate,
      status: new Date(job.resultDate) < new Date() ? 'completed' : 'upcoming',
    });
  }

  // Handlers
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // WhatsApp sharing
    const message = `*${job.title}*\n\n${job.organization}\n\n📍 ${
      job.stateName || 'All India'
    }\n💼 ${job.totalVacancies || 'Multiple'} Vacancies\n\n${
      job.aiSummary || 'Check details at source'
    }\n\nApply: ${job.sourceUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    onShare?.(job.id);
  };

  const handleCardClick = () => {
    onClick?.(job.id);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 ${
        compact ? 'p-3' : 'p-6'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className={`font-bold ${compact ? 'text-lg' : 'text-xl'} mb-2`}>
            {job.title}
          </h3>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{job.organization}</p>
            {job.department && (
              <p className="text-sm text-gray-600">{job.department}</p>
            )}
          </div>
        </div>
        
        {/* Match Score (if applicable) */}
        {showMatchScore && job.matchScore !== undefined && (
          <div>
            <MatchScoreBadge
              score={job.matchScore}
              size={compact ? 'small' : 'medium'}
            />
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Source: {job.sourceDomain || new URL(job.sourceUrl).hostname}</span>
        </span>
        
        {job.aiProcessed && (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z" />
              <path
                fillRule="evenodd"
                d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                clipRule="evenodd"
              />
            </svg>
            AI-Processed
          </span>
        )}
      </div>

      {/* AI Summary */}
      {job.aiSummary && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-purple-900 mb-1">AI Summary</p>
              <p className="text-purple-800">{job.aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Information */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {job.stateName && (
          <div>
            <span className="text-gray-600">📍 Location:</span>
            <p className="font-medium">{job.stateName}</p>
          </div>
        )}
        
        {job.totalVacancies && (
          <div>
            <span className="text-gray-600">💼 Vacancies:</span>
            <p className="font-medium">{job.totalVacancies}</p>
          </div>
        )}
        
        {job.minQualification && (
          <div>
            <span className="text-gray-600">🎓 Qualification:</span>
            <p className="font-medium">{job.minQualification}</p>
          </div>
        )}
        
        {job.minAge && job.maxAge && (
          <div>
            <span className="text-gray-600">📅 Age Limit:</span>
            <p className="font-medium">
              {job.minAge}-{job.maxAge} years
            </p>
          </div>
        )}
      </div>

      {/* Match Reasoning (for authenticated users) */}
      {isAuthenticated &&
        job.matchReasoning &&
        (showDetailedMatch || showMatchDetails) && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-900">
                Why this matches you
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMatchDetails(!showMatchDetails);
                }}
                className="text-green-700 text-xs underline"
              >
                {showMatchDetails ? 'Hide' : 'Show'} details
              </button>
            </div>
            
            {showMatchDetails && (
              <div className="space-y-3 text-sm">
                {/* Strengths */}
                {job.matchReasoning.strengths.length > 0 && (
                  <div>
                    <p className="font-medium text-green-800 mb-1">✓ Strengths:</p>
                    <ul className="list-disc list-inside space-y-1 text-green-700">
                      {job.matchReasoning.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Gaps */}
                {job.matchReasoning.gaps.length > 0 && (
                  <div>
                    <p className="font-medium text-yellow-800 mb-1">⚠ Gaps:</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700">
                      {job.matchReasoning.gaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Recommendations */}
                {job.matchReasoning.recommendations && (
                  <div>
                    <p className="font-medium text-blue-800 mb-1">💡 Tip:</p>
                    <p className="text-blue-700">
                      {job.matchReasoning.recommendations}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* Timeline */}
      {showTimeline && timelineEvents.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Application Timeline:</h4>
          <Timeline events={timelineEvents} compact={compact} />
        </div>
      )}

      {/* Document Checklist */}
      {job.requiredDocuments && job.requiredDocuments.length > 0 && (
        <div className="mb-4">
          <DocumentChecklist
            documents={job.requiredDocuments}
            compact={compact}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className={`flex-1 px-4 py-2 rounded font-medium transition ${
            isSaved
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isSaved ? '✓ Saved' : '🔖 Save'}
        </button>
        
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
        >
          {job.isApplied ? '✓ Applied' : '📝 Apply'}
        </button>
        
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition"
          title="Share on WhatsApp"
        >
          📱 Share
        </button>
        
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-700 text-white rounded font-medium hover:bg-gray-800 transition"
          onClick={(e) => e.stopPropagation()}
        >
          🔗 Official
        </a>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ⚠️ Always verify details from the official source before applying.
          {job.lastUpdated && (
            <span className="block mt-1">
              Last updated:{' '}
              {typeof job.lastUpdated === 'string'
                ? job.lastUpdated
                : job.lastUpdated.toLocaleDateString('en-IN')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default JobCard;
export { MatchScoreBadge, Timeline, DocumentChecklist };

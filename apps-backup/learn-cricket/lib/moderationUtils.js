import fs from 'fs/promises';
import path from 'path';

const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'ai-content-audit.log');

/**
 * Read and parse the audit log file
 * @returns {Promise<Array>} Array of log entries
 */
export async function readAuditLog() {
  try {
    await fs.mkdir(path.dirname(LOG_FILE_PATH), { recursive: true });
    
    try {
      const data = await fs.readFile(LOG_FILE_PATH, 'utf-8');
      const lines = data.trim().split('\n').filter(line => line.trim());
      
      return lines.map((line, index) => {
        try {
          const entry = JSON.parse(line);
          return {
            id: entry.id || `entry-${index}-${Date.now()}`,
            timestamp: entry.timestamp || new Date().toISOString(),
            contentType: entry.contentType || 'unknown',
            reason: entry.reason || 'No reason provided',
            status: entry.status || 'flagged',
            content: entry.content || '',
            metadata: entry.metadata || {}
          };
        } catch (parseError) {
          console.error('Error parsing log line:', parseError);
          return null;
        }
      }).filter(entry => entry !== null);
    } catch (readError) {
      if (readError.code === 'ENOENT') {
        return [];
      }
      throw readError;
    }
  } catch (error) {
    console.error('Error reading audit log:', error);
    return [];
  }
}

/**
 * Update a log entry status
 * @param {string} id - Entry ID to update
 * @param {string} newStatus - New status (approved, rejected, flagged)
 * @returns {Promise<boolean>} Success status
 */
export async function updateLogEntry(id, newStatus) {
  try {
    const entries = await readAuditLog();
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return entry;
    });

    const logContent = updatedEntries.map(entry => JSON.stringify(entry)).join('\n');
    await fs.writeFile(LOG_FILE_PATH, logContent + '\n', 'utf-8');
    
    return true;
  } catch (error) {
    console.error('Error updating log entry:', error);
    return false;
  }
}

/**
 * Filter log entries based on filters
 * @param {Array} entries - Array of log entries
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered entries
 */
export function filterLogEntries(entries, filters = {}) {
  let filtered = [...entries];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(entry => entry.status === filters.status);
  }

  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(entry => 
      entry.contentType.toLowerCase().includes(searchLower) ||
      entry.reason.toLowerCase().includes(searchLower) ||
      (entry.content && entry.content.toLowerCase().includes(searchLower))
    );
  }

  if (filters.contentType && filters.contentType !== 'all') {
    filtered = filtered.filter(entry => entry.contentType === filters.contentType);
  }

  return filtered;
}

/**
 * Get moderation statistics
 * @returns {Promise<Object>} Statistics object
 */
export async function getModerationStats() {
  try {
    const entries = await readAuditLog();
    
    const stats = {
      total: entries.length,
      flagged: entries.filter(e => e.status === 'flagged').length,
      approved: entries.filter(e => e.status === 'approved').length,
      rejected: entries.filter(e => e.status === 'rejected').length
    };

    const contentTypes = {};
    entries.forEach(entry => {
      contentTypes[entry.contentType] = (contentTypes[entry.contentType] || 0) + 1;
    });

    return {
      ...stats,
      contentTypes
    };
  } catch (error) {
    console.error('Error getting moderation stats:', error);
    return {
      total: 0,
      flagged: 0,
      approved: 0,
      rejected: 0,
      contentTypes: {}
    };
  }
}

/**
 * Add a new audit log entry
 * @param {Object} entry - Log entry data
 * @returns {Promise<boolean>} Success status
 */
export async function addAuditLogEntry(entry) {
  try {
    await fs.mkdir(path.dirname(LOG_FILE_PATH), { recursive: true });
    
    const logEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: new Date().toISOString(),
      contentType: entry.contentType || 'unknown',
      reason: entry.reason || 'No reason provided',
      status: entry.status || 'flagged',
      content: entry.content || '',
      metadata: entry.metadata || {}
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(LOG_FILE_PATH, logLine, 'utf-8');
    
    return true;
  } catch (error) {
    console.error('Error adding audit log entry:', error);
    return false;
  }
}

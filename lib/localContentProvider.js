/**
 * Local Content Provider
 *
 * This module provides a mock data provider that reads from a local JSON snapshot
 * instead of querying Supabase. This is useful for testing and QA purposes.
 *
 * Enable by setting: NEXT_PUBLIC_USE_LOCAL_CONTENT=true
 *
 * Usage:
 * - Set NEXT_PUBLIC_USE_LOCAL_CONTENT=true in .env.local
 * - Run the app locally with npm run dev
 * - Admin UIs will fetch data from seeds/content.json instead of Supabase
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * @type {Object|null} Cache for loaded content from seeds/content.json
 */
let localData = null;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load content from the local JSON snapshot
 * @returns {Object} Parsed JSON content from seeds/content.json
 */
function loadLocalContent() {
  if (localData) {
    return localData;
  }

  try {
    // Try multiple possible paths for the content.json file
    const possiblePaths = [
      path.join(process.cwd(), "seeds", "content.json"),
      path.join(process.cwd(), "..", "seeds", "content.json"),
      path.join(__dirname, "..", "seeds", "content.json"),
    ];

    let contentPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        contentPath = testPath;
        break;
      }
    }

    if (!contentPath) {
      console.warn("⚠️ Local content file not found. Returning empty data.");
      return {
        courses: [],
        modules: [],
        lessons: [],
        profiles: [],
        questions: [],
      };
    }

    const fileContent = fs.readFileSync(contentPath, "utf-8");
    localData = JSON.parse(fileContent);
    console.log("✓ Loaded local content from:", contentPath);
    return localData;
  } catch (error) {
    console.error("Error loading local content:", error);
    return {
      courses: [],
      modules: [],
      lessons: [],
      profiles: [],
      questions: [],
    };
  }
}

/**
 * Create a mock Supabase client that reads from local JSON instead of database
 * This mimics the Supabase client API structure for compatibility
 */
export function createLocalContentClient() {
  console.log("🔧 LOCAL CONTENT MODE: Using mock data from seeds/content.json");

  /**
   * Create a query chain that filters and returns local data
   * @param {string} table - Table name to query
   */
  const createQueryChain = (table) => {
    let data = loadLocalContent()[table] || [];
    let filters = [];
    let selectFields = '*';
    let orderConfig = null;
    let limitValue = null;

    const chain = {
      select: (fields = '*') => {
        selectFields = fields;
        return chain;
      },

      eq: (field, value) => {
        filters.push({ field, op: 'eq', value });
        return chain;
      },

      neq: (field, value) => {
        filters.push({ field, op: 'neq', value });
        return chain;
      },

      gt: (field, value) => {
        filters.push({ field, op: 'gt', value });
        return chain;
      },

      gte: (field, value) => {
        filters.push({ field, op: 'gte', value });
        return chain;
      },

      lt: (field, value) => {
        filters.push({ field, op: 'lt', value });
        return chain;
      },

      lte: (field, value) => {
        filters.push({ field, op: 'lte', value });
        return chain;
      },

      like: (field, pattern) => {
        filters.push({ field, op: 'like', value: pattern });
        return chain;
      },

      ilike: (field, pattern) => {
        filters.push({ field, op: 'ilike', value: pattern });
        return chain;
      },

      is: (field, value) => {
        filters.push({ field, op: 'is', value });
        return chain;
      },

      in: (field, values) => {
        filters.push({ field, op: 'in', value: values });
        return chain;
      },

      contains: (field, value) => {
        filters.push({ field, op: 'contains', value });
        return chain;
      },

      containedBy: (field, value) => {
        filters.push({ field, op: 'containedBy', value });
        return chain;
      },

      range: (from, to) => {
        // Pagination support
        return chain;
      },

      match: (query) => {
        Object.entries(query).forEach(([field, value]) => {
          filters.push({ field, op: 'eq', value });
        });
        return chain;
      },

      not: (field, op, value) => {
        filters.push({ field, op: 'not', value });
        return chain;
      },

      or: (query) => {
        // Simplified OR logic
        return chain;
      },

      filter: (field, op, value) => {
        filters.push({ field, op, value });
        return chain;
      },

      order: (field, options = {}) => {
        orderConfig = { field, ascending: options.ascending !== false };
        return chain;
      },

      limit: (count) => {
        limitValue = count;
        return chain;
      },

      single: async () => {
        const result = await chain.then((res) => res);
        if (result.error) return result;
        if (!result.data || result.data.length === 0) {
          return { data: null, error: null };
        }
        return { data: result.data[0], error: null };
      },

      maybeSingle: async () => {
        const result = await chain.then((res) => res);
        if (result.error) return result;
        return { data: result.data?.[0] || null, error: null };
      },

      insert: (records) => {
        // Mock insert - just return success
        return {
          select: () => ({
            then: async (resolve) => {
              const result = { data: Array.isArray(records) ? records : [records], error: null };
              return resolve ? resolve(result) : result;
            },
          }),
          then: async (resolve) => {
            const result = { data: Array.isArray(records) ? records : [records], error: null };
            return resolve ? resolve(result) : result;
          },
        };
      },

      update: (values) => {
        // Mock update - just return success
        return {
          eq: () => ({
            then: async (resolve) => {
              const result = { data: [values], error: null };
              return resolve ? resolve(result) : result;
            },
          }),
          then: async (resolve) => {
            const result = { data: [values], error: null };
            return resolve ? resolve(result) : result;
          },
        };
      },

      upsert: (records) => {
        // Mock upsert - just return success
        return {
          then: async (resolve) => {
            const result = { data: Array.isArray(records) ? records : [records], error: null };
            return resolve ? resolve(result) : result;
          },
        };
      },

      delete: () => {
        // Mock delete - just return success
        return {
          eq: () => ({
            then: async (resolve) => {
              const result = { data: null, error: null };
              return resolve ? resolve(result) : result;
            },
          }),
          then: async (resolve) => {
            const result = { data: null, error: null };
            return resolve ? resolve(result) : result;
          },
        };
      },

      then: async (resolve) => {
        // Apply filters
        let filteredData = [...data];

        filters.forEach(({ field, op, value }) => {
          filteredData = filteredData.filter((item) => {
            const itemValue = item[field];

            switch (op) {
              case "eq":
                return itemValue === value;
              case "neq":
                return itemValue !== value;
              case "gt":
                // Handle null/undefined values in comparison
                if (itemValue == null || value == null) return false;
                return itemValue > value;
              case "gte":
                // Handle null/undefined values in comparison
                if (itemValue == null || value == null) return false;
                return itemValue >= value;
              case "lt":
                // Handle null/undefined values in comparison
                if (itemValue == null || value == null) return false;
                return itemValue < value;
              case "lte":
                // Handle null/undefined values in comparison
                if (itemValue == null || value == null) return false;
                return itemValue <= value;
              case "like":
              case "ilike":
                // Escape special regex characters before replacing % with .*
                const escapedValue = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const pattern = escapedValue.replace(/%/g, ".*");
                const regex = new RegExp(pattern, op === "ilike" ? "i" : "");
                return regex.test(String(itemValue || ""));
              case "is":
                return itemValue === value;
              case "in":
                return Array.isArray(value) && value.includes(itemValue);
              case "contains":
                return Array.isArray(itemValue) && itemValue.includes(value);
              case "not":
                return itemValue !== value;
              default:
                return true;
            }
          });
        });

        // Apply ordering
        if (orderConfig) {
          filteredData.sort((a, b) => {
            const aVal = a[orderConfig.field];
            const bVal = b[orderConfig.field];
            
            // Handle null/undefined values - treat them as less than any value
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return orderConfig.ascending ? -1 : 1;
            if (bVal == null) return orderConfig.ascending ? 1 : -1;
            
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return orderConfig.ascending ? comparison : -comparison;
          });
        }

        // Apply limit
        if (limitValue) {
          filteredData = filteredData.slice(0, limitValue);
        }

        const result = { data: filteredData, error: null };
        return resolve ? resolve(result) : result;
      },
    };

    return chain;
  };

  return {
    from: (table) => createQueryChain(table),
    rpc: async (fn, params) => ({
      data: null,
      error: { message: 'RPC not supported in local content mode' },
    }),
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Auth not supported in local content mode' },
      }),
      signInWithOtp: async () => ({
        data: null,
        error: { message: 'Auth not supported in local content mode' },
      }),
      signInWithOAuth: async () => ({
        data: null,
        error: { message: 'Auth not supported in local content mode' },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: 'Auth not supported in local content mode' },
      }),
      resetPasswordForEmail: async () => ({
        data: null,
        error: { message: 'Auth not supported in local content mode' },
      }),
      updateUser: async () => ({
        data: { user: null },
        error: { message: 'Auth not supported in local content mode' },
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    storage: {
      from: () => ({
        upload: async () => ({
          data: null,
          error: { message: 'Storage not supported in local content mode' },
        }),
        download: async () => ({
          data: null,
          error: { message: 'Storage not supported in local content mode' },
        }),
        list: async () => ({
          data: [],
          error: null,
        }),
        remove: async () => ({
          data: null,
          error: { message: 'Storage not supported in local content mode' },
        }),
        createSignedUrl: async () => ({
          data: null,
          error: { message: 'Storage not supported in local content mode' },
        }),
        getPublicUrl: () => ({
          data: { publicUrl: '' },
        }),
      }),
    },
  };
}

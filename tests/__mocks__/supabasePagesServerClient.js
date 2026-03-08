/**
 * Jest mock for Supabase Pages/Server clients (TypeScript source files).
 *
 * These files use TypeScript syntax (`import type`) that the Jest Babel
 * transform does not support without @babel/preset-typescript.  Tests that
 * import code depending on these modules (e.g. save-profile.js) need this
 * mock so Jest can load the file without trying to parse TypeScript.
 */

"use strict";

function createSupabasePagesServerClient() {
  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  };
}

module.exports = { createSupabasePagesServerClient };

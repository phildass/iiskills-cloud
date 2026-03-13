// Shared Utils - Entry Point
// Re-exports all shared utilities used across iiskills.cloud apps

// Library utilities
export * from "./lib/accessManager";
export * from "./lib/appRegistry";
export * from "./lib/bundleConfig";
export * from "./lib/contentDiscovery";
export * from "./lib/contentFilter";
export * from "./lib/contentSchema";
export * from "./lib/freeAccess";
export * from "./lib/gatekeeperUtils";
export * from "./lib/localContentProvider";
export * from "./lib/phoneValidation";
export * from "./lib/razorpay";
export * from "./lib/sessionManager";
export * from "./lib/validateRuntimeEnv";

// Client-side utilities
export * from "./utils/certificateGenerator";
export * from "./utils/client-protection";
export * from "./utils/courseSubdomainMapper";
export * from "./utils/courseSubdomainMapperClient";
export * from "./utils/data";
export * from "./utils/pricing";
export * from "./utils/urlHelper";
export * from "./utils/useNewsletterPopup";

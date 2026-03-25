/**
 * DEPRECATED: This file is maintained for backward compatibility
 * 
 * Please import from the organized subdirectory instead:
 * import { GET_BOOKS, GET_ME, GET_STATS } from "./queries";
 * 
 * New structure:
 * - /queries/index.js - All query operations organized by domain
 * - /mutations/index.js - All mutation operations organized by domain
 */

// Re-export everything from the new organized structure
export * from "./queries/index.js";

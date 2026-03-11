/**
 * AdminProtectedPage — thin compatibility wrapper around AdminGate.
 *
 * All admin-gate logic (health check → Supabase bridge → cookie mint → retry)
 * now lives in AdminGate.js. This file re-exports the hook and component under
 * the original names so existing admin pages need no changes.
 *
 * Usage (unchanged):
 *   import { useAdminProtectedPage, AccessDenied } from '../../components/AdminProtectedPage';
 *   const { ready, denied } = useAdminProtectedPage();
 *   const { ready, denied } = useAdminProtectedPage({ requireSuperadmin: true });
 */

export { useAdminGate as useAdminProtectedPage, AccessDenied } from "./AdminGate";

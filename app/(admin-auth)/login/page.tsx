import { redirect } from 'next/navigation';

/**
 * Legacy admin auth route - redirects to new admin login
 * Old route: /admin-auth/login → New route: /admin-login
 */
export default function AdminLoginRedirect() {
  redirect('/admin-login');
}

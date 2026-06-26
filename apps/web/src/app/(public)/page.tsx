import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PublicHomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_id');

  redirect(sessionCookie ? '/dashboard' : '/login');
}

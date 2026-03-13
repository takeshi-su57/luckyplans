'use client';

import { useHealth } from '@/hooks/use-health';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function DashboardPage() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { data, loading: healthLoading, error: healthError } = useHealth();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
      {userLoading ? (
        <div className="h-8 w-64 animate-pulse rounded bg-neutral-200" />
      ) : (
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-sm font-medium text-neutral-500">Profile</h2>
          {userLoading ? (
            <div className="mt-4 space-y-3">
              <div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
            </div>
          ) : user ? (
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-xs text-neutral-400">Email</span>
                <p className="text-sm font-medium text-neutral-900">{user.email}</p>
              </div>
              {user.name && (
                <div>
                  <span className="text-xs text-neutral-400">Name</span>
                  <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-neutral-400">Roles</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-sm font-medium text-neutral-500">API Status</h2>
          <div className="mt-4">
            {healthLoading && (
              <p className="text-sm text-neutral-500">Checking connection...</p>
            )}
            {healthError && (
              <p className="text-sm text-red-600">Error: {healthError.message}</p>
            )}
            {data && (
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <p className="text-sm font-medium text-neutral-900">{data.health}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

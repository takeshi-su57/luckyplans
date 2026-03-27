'use client';

import { useHealth } from '@/hooks/use-health';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Avatar, Card, Chip, Skeleton } from '@heroui/react';
import { Activity, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { data, loading: healthLoading, error: healthError } = useHealth();

  return (
    <div>
      {userLoading ? (
        <Skeleton className="h-8 w-64 rounded-lg" />
      ) : (
        <h1 className="text-[40px] font-bold text-[#37352f] leading-tight">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2 text-sm font-medium text-[#787774]">
              <User className="size-5" />
              Profile
            </Card.Title>
          </Card.Header>
          <Card.Content>
            {userLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-lg" />
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <Avatar.Fallback>
                      {(user.name ?? user.email ?? 'U').charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <div>
                    {user.name && (
                      <p className="text-sm font-medium text-[#37352f]">{user.name}</p>
                    )}
                    <p className="text-xs text-[#787774]">{user.email}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#a3a29e]">Roles</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Chip key={role} size="sm" color="success">
                        {role}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2 text-sm font-medium text-[#787774]">
              <Activity className="size-5" />
              API Status
            </Card.Title>
          </Card.Header>
          <Card.Content>
            {healthLoading && (
              <p className="text-sm text-[#787774]">Checking connection...</p>
            )}
            {healthError && (
              <p className="text-sm text-danger">Error: {healthError.message}</p>
            )}
            {data && (
              <Chip size="sm" color="success">
                {data.health}
              </Chip>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

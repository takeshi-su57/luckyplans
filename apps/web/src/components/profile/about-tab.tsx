'use client';

import { useCallback, useState } from 'react';
import { Button, Card, Chip, TextField, Label, Input, TextArea } from '@heroui/react';
import { Loader2, Pencil } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/use-update-profile';
import { SocialLinksSection } from '@/components/profile/social-links-section';
import { ImageUpload } from '@/components/ui/image-upload';

interface AboutTabProps {
  userId: string;
  user: {
    email: string;
    roles: string[];
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    headline?: string | null;
    location?: string | null;
  };
}

export function AboutTab({ user, userId }: AboutTabProps) {
  const [updateProfile, { loading: saving }] = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatarUrl: '',
    headline: '',
    location: '',
  });

  const startEditing = useCallback(() => {
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      bio: user.bio ?? '',
      avatarUrl: user.avatarUrl ?? '',
      headline: user.headline ?? '',
      location: user.location ?? '',
    });
    setIsEditing(true);
    setSuccessMsg('');
  }, [user]);

  const handleSave = useCallback(async () => {
    await updateProfile({ variables: { input: form } });
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  }, [form, updateProfile]);

  return (
    <div className="space-y-6">
      {successMsg && (
        <Card className="bg-[#dbeddb]">
          <Card.Content>
            <p className="text-sm text-[#0f7b6c]">{successMsg}</p>
          </Card.Content>
        </Card>
      )}

      {/* Read-only fields */}
      <Card>
        <Card.Header>
          <Card.Title>Account</Card.Title>
        </Card.Header>
        <Card.Content className="gap-4">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#a3a29e]">Email</span>
              <p className="text-sm font-medium text-[#37352f]">{user.email}</p>
            </div>
            <div>
              <span className="text-xs text-[#a3a29e]">Roles</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {user.roles.map((role) => (
                  <Chip key={role} size="sm">
                    {role}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Editable fields */}
      <Card>
        <Card.Header>
          <div className="flex w-full items-center justify-between">
            <Card.Title>Personal Info</Card.Title>
            {!isEditing && (
              <Button isIconOnly variant="ghost" size="sm" onPress={startEditing}>
                <Pencil className="size-4" />
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Content className="gap-3">
          {isEditing ? (
            <>
              <TextField onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}>
                <Label>First Name</Label>
                <Input value={form.firstName} />
              </TextField>
              <TextField onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}>
                <Label>Last Name</Label>
                <Input value={form.lastName} />
              </TextField>
              <TextField onChange={(v) => setForm((f) => ({ ...f, headline: v }))}>
                <Label>Headline</Label>
                <Input placeholder="e.g., Full-stack developer" value={form.headline} />
              </TextField>
              <TextField onChange={(v) => setForm((f) => ({ ...f, location: v }))}>
                <Label>Location</Label>
                <Input placeholder="e.g., San Francisco, CA" value={form.location} />
              </TextField>
              <div>
                <span className="text-xs text-[#a3a29e]">Avatar</span>
                <ImageUpload
                  value={form.avatarUrl}
                  onChange={(key) => setForm((f) => ({ ...f, avatarUrl: key }))}
                  prefix="avatars"
                />
              </div>
              <TextField onChange={(v) => setForm((f) => ({ ...f, bio: v }))}>
                <Label>Bio</Label>
                <TextArea value={form.bio} />
              </TextField>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#a3a29e]">First Name</span>
                <p className="text-sm font-medium text-[#37352f]">
                  {user.firstName ?? '-'}
                </p>
              </div>
              <div>
                <span className="text-xs text-[#a3a29e]">Last Name</span>
                <p className="text-sm font-medium text-[#37352f]">
                  {user.lastName ?? '-'}
                </p>
              </div>
              <div>
                <span className="text-xs text-[#a3a29e]">Headline</span>
                <p className="text-sm font-medium text-[#37352f]">
                  {user.headline ?? '-'}
                </p>
              </div>
              <div>
                <span className="text-xs text-[#a3a29e]">Location</span>
                <p className="text-sm font-medium text-[#37352f]">
                  {user.location ?? '-'}
                </p>
              </div>
              <div>
                <span className="text-xs text-[#a3a29e]">Avatar</span>
                {user.avatarUrl ? (
                  <img
                    src={`/uploads/${user.avatarUrl}`}
                    alt="Avatar"
                    className="mt-1 h-16 w-16 rounded-lg object-cover border border-[#e8e7e4]"
                  />
                ) : (
                  <p className="text-sm font-medium text-[#37352f]">-</p>
                )}
              </div>
              <div>
                <span className="text-xs text-[#a3a29e]">Bio</span>
                <p className="text-sm font-medium text-[#37352f]">{user.bio ?? '-'}</p>
              </div>
            </div>
          )}
        </Card.Content>
        {isEditing && (
          <Card.Footer className="gap-2">
            <Button isPending={saving} onPress={handleSave}>
              {({ isPending }) =>
                isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save'
                )
              }
            </Button>
            <Button variant="outline" size="sm" onPress={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Card.Footer>
        )}
      </Card>

      {/* Social Links -- dynamic section */}
      <SocialLinksSection userId={userId} />
    </div>
  );
}

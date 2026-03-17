'use client';

import { useCallback, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUpdateProfile } from '@/hooks/use-update-profile';

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();
  const [updateProfile, { loading: saving }] = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatarUrl: '',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const startEditing = useCallback(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      bio: user.bio ?? '',
      avatarUrl: user.avatarUrl ?? '',
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 md:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="mt-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
          >
            Edit
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Read-only fields */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-sm font-medium text-neutral-500">Account</h2>
          <div className="mt-4 space-y-4">
            <Field label="Email" value={user.email} />
            <Field label="Roles" value={user.roles.join(', ')} />
          </div>
        </div>

        {/* Editable fields */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-sm font-medium text-neutral-500">Personal Info</h2>
          <div className="mt-4 space-y-4">
            {isEditing ? (
              <>
                <EditField
                  label="First Name"
                  value={form.firstName}
                  onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                />
                <EditField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                />
                <EditField
                  label="Avatar URL"
                  value={form.avatarUrl}
                  onChange={(v) => setForm((f) => ({ ...f, avatarUrl: v }))}
                />
                <div>
                  <label className="block text-xs text-neutral-400">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <Field label="First Name" value={user.firstName ?? '-'} />
                <Field label="Last Name" value={user.lastName ?? '-'} />
                <Field label="Avatar URL" value={user.avatarUrl ?? '-'} />
                <Field label="Bio" value={user.bio ?? '-'} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-neutral-400">{label}</span>
      <p className="text-sm font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-neutral-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
}

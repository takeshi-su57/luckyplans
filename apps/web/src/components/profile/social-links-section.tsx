'use client';

import type { ComponentType } from 'react';
import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  Chip,
  Skeleton,
  TextField,
  Label,
  Input,
  Select,
  ListBox,
} from '@heroui/react';
import {
  ExternalLink,
  Globe,
  Link as LinkIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateSocialLink } from '@/hooks/use-create-social-link';
import { useUpdateSocialLink } from '@/hooks/use-update-social-link';
import { useDeleteSocialLink } from '@/hooks/use-delete-social-link';

interface SocialLinksSectionProps {
  userId: string;
}

const PLATFORM_OPTIONS = ['WEBSITE', 'GITHUB', 'LINKEDIN', 'TWITTER', 'YOUTUBE', 'OTHER'] as const;

const PLATFORM_LABELS: Record<string, string> = {
  WEBSITE: 'Website',
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'Twitter',
  YOUTUBE: 'YouTube',
  OTHER: 'Other',
};

const PLATFORM_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  WEBSITE: Globe,
  GITHUB: ExternalLink,
  LINKEDIN: ExternalLink,
  TWITTER: ExternalLink,
  YOUTUBE: ExternalLink,
  OTHER: LinkIcon,
};

interface SocialLinkForm {
  platform: string;
  url: string;
  label: string;
}

const emptyForm: SocialLinkForm = {
  platform: 'WEBSITE',
  url: '',
  label: '',
};

export function SocialLinksSection({ userId }: SocialLinksSectionProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createSocialLink, { loading: creating }] = useCreateSocialLink();
  const [updateSocialLink, { loading: updating }] = useUpdateSocialLink();
  const [deleteSocialLink] = useDeleteSocialLink();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SocialLinkForm>(emptyForm);

  const socialLinks = data?.getPublicProfile?.socialLinks ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (link: { id: string; platform: string; url: string; label?: string | null }) => {
      setForm({
        platform: link.platform,
        url: link.url,
        label: link.label ?? '',
      });
      setEditingId(link.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      platform: form.platform,
      url: form.url,
      label: form.label || undefined,
    };

    if (editingId) {
      await updateSocialLink({ variables: { id: editingId, input } });
    } else {
      await createSocialLink({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createSocialLink, updateSocialLink]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteSocialLink({ variables: { id } });
    },
    [deleteSocialLink],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-center justify-between">
          <Card.Title>Social Links</Card.Title>
          <Button size="sm" onPress={startCreate}>
            <Plus className="size-4" /> Add Link
          </Button>
        </div>
      </Card.Header>
      <Card.Content className="gap-4">
        {showForm && (
          <Card className="border-[#0b6e99] bg-[#d3e5ef]">
            <Card.Header>
              <Card.Title>{editingId ? 'Edit Link' : 'New Link'}</Card.Title>
            </Card.Header>
            <Card.Content className="gap-3">
              <Select
                selectedKey={form.platform}
                onSelectionChange={(key) => setForm((f) => ({ ...f, platform: String(key) }))}
              >
                <Label>Platform</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {PLATFORM_OPTIONS.map((opt) => (
                      <ListBox.Item key={opt} id={opt} textValue={PLATFORM_LABELS[opt]}>
                        {PLATFORM_LABELS[opt]}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <TextField onChange={(v) => setForm((f) => ({ ...f, url: v }))}>
                <Label>URL</Label>
                <Input placeholder="https://..." value={form.url} />
              </TextField>
              <TextField onChange={(v) => setForm((f) => ({ ...f, label: v }))}>
                <Label>Label (optional)</Label>
                <Input placeholder="e.g., My Portfolio" value={form.label} />
              </TextField>
            </Card.Content>
            <Card.Footer className="gap-2">
              <Button
                isPending={creating || updating}
                isDisabled={!form.url}
                onPress={handleSave}
              >
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
              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </Card.Footer>
          </Card>
        )}

        {socialLinks.map((link) => (
          <Card key={link.id}>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const PlatformIcon = PLATFORM_ICONS[link.platform] ?? LinkIcon;
                    return <PlatformIcon className="size-4 text-[#787774]" />;
                  })()}
                  <span className="font-medium text-[#37352f]">
                    {PLATFORM_LABELS[link.platform] ?? link.platform}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0b6e99] hover:text-[#0b6e99] truncate max-w-xs"
                  >
                    {link.url}
                  </a>
                  {link.label && (
                    <Chip size="sm">{link.label}</Chip>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(link)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="danger-soft"
                    size="sm"
                    onPress={() => handleDelete(link.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}

        {socialLinks.length === 0 && !showForm && (
          <Card className="border border-dashed border-[#e8e7e4]">
            <Card.Content className="flex flex-col items-center gap-3 py-12">
              <LinkIcon className="size-10 text-[#a3a29e]" />
              <p className="text-sm text-[#a3a29e]">
                No social links yet. Add links to your profiles and website.
              </p>
            </Card.Content>
          </Card>
        )}
      </Card.Content>
    </Card>
  );
}

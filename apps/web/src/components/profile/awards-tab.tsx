'use client';

import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  Skeleton,
  TextField,
  Label,
  Input,
  TextArea,
} from '@heroui/react';
import { Loader2, Pencil, Plus, Trash2, Trophy } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateAward } from '@/hooks/use-create-award';
import { useUpdateAward } from '@/hooks/use-update-award';
import { useDeleteAward } from '@/hooks/use-delete-award';

interface AwardsTabProps {
  userId: string;
}

interface AwardForm {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

const emptyForm: AwardForm = {
  title: '',
  issuer: '',
  date: '',
  description: '',
};

export function AwardsTab({ userId }: AwardsTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createAward, { loading: creating }] = useCreateAward();
  const [updateAward, { loading: updating }] = useUpdateAward();
  const [deleteAward] = useDeleteAward();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AwardForm>(emptyForm);

  const awards = data?.getPublicProfile?.awards ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (award: {
      id: string;
      title: string;
      issuer?: string | null;
      date?: string | null;
      description?: string | null;
    }) => {
      setForm({
        title: award.title,
        issuer: award.issuer ?? '',
        date: award.date ? new Date(award.date).toISOString().split('T')[0] : '',
        description: award.description ?? '',
      });
      setEditingId(award.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      title: form.title,
      issuer: form.issuer || undefined,
      date: form.date || undefined,
      description: form.description || undefined,
    };

    if (editingId) {
      await updateAward({ variables: { id: editingId, input } });
    } else {
      await createAward({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createAward, updateAward]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteAward({ variables: { id } });
    },
    [deleteAward],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#787774]">{awards.length} award(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Award
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Award' : 'New Award'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, title: v }))}>
              <Label>Title</Label>
              <Input value={form.title} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, issuer: v }))}>
              <Label>Issuer</Label>
              <Input value={form.issuer} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, date: v }))}>
              <Label>Date</Label>
              <Input type="date" value={form.date} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, description: v }))}>
              <Label>Description</Label>
              <TextArea value={form.description} />
            </TextField>
          </Card.Content>
          <Card.Footer className="gap-2">
            <Button
              isPending={creating || updating}
              isDisabled={!form.title}
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

      {awards.map((award) => (
        <Card key={award.id}>
          <Card.Content>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[#37352f]">{award.title}</h3>
                {award.issuer && (
                  <p className="text-sm text-[#37352f]">{award.issuer}</p>
                )}
                {award.date && (
                  <span className="mt-1 text-xs text-[#a3a29e]">
                    {new Date(award.date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {award.description && (
                  <p className="mt-2 text-sm text-[#37352f] leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(award)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="danger-soft"
                  size="sm"
                  onPress={() => handleDelete(award.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}

      {awards.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <Trophy className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No awards yet. Add your achievements and recognitions.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

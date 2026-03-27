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
import { Heart, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateHobby } from '@/hooks/use-create-hobby';
import { useUpdateHobby } from '@/hooks/use-update-hobby';
import { useDeleteHobby } from '@/hooks/use-delete-hobby';

interface HobbiesTabProps {
  userId: string;
}

interface HobbyForm {
  name: string;
  description: string;
}

const emptyForm: HobbyForm = {
  name: '',
  description: '',
};

export function HobbiesTab({ userId }: HobbiesTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createHobby, { loading: creating }] = useCreateHobby();
  const [updateHobby, { loading: updating }] = useUpdateHobby();
  const [deleteHobby] = useDeleteHobby();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HobbyForm>(emptyForm);

  const hobbies = data?.getPublicProfile?.hobbies ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (hobby: {
      id: string;
      name: string;
      description?: string | null;
    }) => {
      setForm({
        name: hobby.name,
        description: hobby.description ?? '',
      });
      setEditingId(hobby.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      name: form.name,
      description: form.description || undefined,
    };

    if (editingId) {
      await updateHobby({ variables: { id: editingId, input } });
    } else {
      await createHobby({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createHobby, updateHobby]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteHobby({ variables: { id } });
    },
    [deleteHobby],
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#787774]">{hobbies.length} hobby(ies)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Hobby
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Hobby' : 'New Hobby'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, name: v }))}>
              <Label>Name</Label>
              <Input value={form.name} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, description: v }))}>
              <Label>Description</Label>
              <TextArea value={form.description} />
            </TextField>
          </Card.Content>
          <Card.Footer className="gap-2">
            <Button
              isPending={creating || updating}
              isDisabled={!form.name}
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

      {hobbies.length > 0 && (
        <div className="space-y-3">
          {hobbies.map((hobby) => (
            <Card key={hobby.id}>
              <Card.Content>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[#37352f]">{hobby.name}</h3>
                    {hobby.description && (
                      <p className="mt-1 text-sm text-[#37352f] leading-relaxed">
                        {hobby.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(hobby)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="danger-soft"
                      size="sm"
                      onPress={() => handleDelete(hobby.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {hobbies.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <Heart className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No hobbies yet. Share your interests and passions.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

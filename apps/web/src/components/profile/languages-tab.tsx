'use client';

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
import { Languages, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateLanguage } from '@/hooks/use-create-language';
import { useUpdateLanguage } from '@/hooks/use-update-language';
import { useDeleteLanguage } from '@/hooks/use-delete-language';

interface LanguagesTabProps {
  userId: string;
}

interface LanguageForm {
  name: string;
  proficiency: string;
}

const emptyForm: LanguageForm = {
  name: '',
  proficiency: 'Conversational',
};

const proficiencyOptions = ['Native', 'Fluent', 'Conversational', 'Basic'];

export function LanguagesTab({ userId }: LanguagesTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createLanguage, { loading: creating }] = useCreateLanguage();
  const [updateLanguage, { loading: updating }] = useUpdateLanguage();
  const [deleteLanguage] = useDeleteLanguage();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LanguageForm>(emptyForm);

  const languages = data?.getPublicProfile?.languages ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (lang: {
      id: string;
      name: string;
      proficiency?: string | null;
    }) => {
      setForm({
        name: lang.name,
        proficiency: lang.proficiency ?? 'Conversational',
      });
      setEditingId(lang.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      name: form.name,
      proficiency: form.proficiency || undefined,
    };

    if (editingId) {
      await updateLanguage({ variables: { id: editingId, input } });
    } else {
      await createLanguage({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createLanguage, updateLanguage]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteLanguage({ variables: { id } });
    },
    [deleteLanguage],
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
        <p className="text-sm text-[#787774]">{languages.length} language(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Language
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Language' : 'New Language'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, name: v }))}>
              <Label>Language</Label>
              <Input value={form.name} />
            </TextField>
            <Select
              selectedKey={form.proficiency}
              onSelectionChange={(key) => setForm((f) => ({ ...f, proficiency: String(key) }))}
            >
              <Label>Proficiency</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {proficiencyOptions.map((opt) => (
                    <ListBox.Item key={opt} id={opt} textValue={opt}>
                      {opt}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
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

      {languages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {languages.map((lang) => (
            <Card key={lang.id}>
              <Card.Content className="flex-row items-center gap-2 py-2 px-3">
                <span className="text-sm font-medium text-[#37352f]">{lang.name}</span>
                {lang.proficiency && (
                  <Chip size="sm" color="success">
                    {lang.proficiency}
                  </Chip>
                )}
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(lang)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="danger-soft"
                    size="sm"
                    onPress={() => handleDelete(lang.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {languages.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <Languages className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No languages yet. Add the languages you speak.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

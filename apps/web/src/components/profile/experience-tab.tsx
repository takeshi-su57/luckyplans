'use client';

import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  Skeleton,
  TextField,
  Label,
  Input,
} from '@heroui/react';
import { Briefcase, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateExperience } from '@/hooks/use-create-experience';
import { useUpdateExperience } from '@/hooks/use-update-experience';
import { useDeleteExperience } from '@/hooks/use-delete-experience';

interface ExperienceTabProps {
  userId: string;
}

interface ExperienceForm {
  company: string;
  role: string;
  description: string[];
  startDate: string;
  endDate: string;
}

const emptyForm: ExperienceForm = {
  company: '',
  role: '',
  description: [''],
  startDate: '',
  endDate: '',
};

export function ExperienceTab({ userId }: ExperienceTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createExperience, { loading: creating }] = useCreateExperience();
  const [updateExperience, { loading: updating }] = useUpdateExperience();
  const [deleteExperience] = useDeleteExperience();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);

  const experiences = data?.getPublicProfile?.experiences ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (exp: {
      id: string;
      company: string;
      role: string;
      description: string[];
      startDate: string;
      endDate?: string | null;
    }) => {
      setForm({
        company: exp.company,
        role: exp.role,
        description: exp.description.length > 0 ? [...exp.description] : [''],
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      });
      setEditingId(exp.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const filteredDesc = form.description.filter((d) => d.trim() !== '');
    const input = {
      company: form.company,
      role: form.role,
      description: filteredDesc.length > 0 ? filteredDesc : undefined,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
    };

    if (editingId) {
      await updateExperience({ variables: { id: editingId, input } });
    } else {
      await createExperience({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createExperience, updateExperience]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteExperience({ variables: { id } });
    },
    [deleteExperience],
  );

  const addDescItem = useCallback(() => {
    setForm((f) => ({ ...f, description: [...f.description, ''] }));
  }, []);

  const removeDescItem = useCallback((index: number) => {
    setForm((f) => ({
      ...f,
      description: f.description.filter((_, i) => i !== index),
    }));
  }, []);

  const updateDescItem = useCallback((index: number, value: string) => {
    setForm((f) => ({
      ...f,
      description: f.description.map((d, i) => (i === index ? value : d)),
    }));
  }, []);

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
        <p className="text-sm text-[#787774]">{experiences.length} experience(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Experience
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Experience' : 'New Experience'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, company: v }))}>
              <Label>Company</Label>
              <Input value={form.company} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, role: v }))}>
              <Label>Role</Label>
              <Input value={form.role} />
            </TextField>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#787774]">Description Items</span>
                <Button variant="ghost" size="sm" onPress={addDescItem}>
                  <Plus className="size-4" /> Add item
                </Button>
              </div>
              <div className="mt-1 space-y-2">
                {form.description.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <TextField
                      className="flex-1"
                      onChange={(v) => updateDescItem(index, v)}
                    >
                      <Label className="sr-only">Item {index + 1}</Label>
                      <Input placeholder={`Item ${index + 1}`} value={item} />
                    </TextField>
                    {form.description.length > 1 && (
                      <Button
                        isIconOnly
                        variant="danger-soft"
                        size="sm"
                        onPress={() => removeDescItem(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}>
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} />
              </TextField>
              <TextField onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}>
                <Label>End Date (leave empty for current)</Label>
                <Input type="date" value={form.endDate} />
              </TextField>
            </div>
          </Card.Content>
          <Card.Footer className="gap-2">
            <Button
              isPending={creating || updating}
              isDisabled={!form.company || !form.role || !form.startDate}
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

      {experiences.map((exp) => (
        <Card key={exp.id}>
          <Card.Content>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[#37352f]">{exp.role}</h3>
                <p className="text-sm text-[#37352f]">{exp.company}</p>
                <span className="mt-1 text-xs text-[#a3a29e]">
                  {new Date(exp.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' - '}
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Present'}
                </span>
                {exp.description.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 space-y-0.5">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-sm text-[#37352f] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(exp)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="danger-soft"
                  size="sm"
                  onPress={() => handleDelete(exp.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}

      {experiences.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <Briefcase className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No experience yet. Add your work history to showcase your career.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

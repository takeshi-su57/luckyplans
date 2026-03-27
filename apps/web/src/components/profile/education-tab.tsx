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
import { GraduationCap, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateEducation } from '@/hooks/use-create-education';
import { useUpdateEducation } from '@/hooks/use-update-education';
import { useDeleteEducation } from '@/hooks/use-delete-education';

interface EducationTabProps {
  userId: string;
}

interface EducationForm {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string[];
}

const emptyForm: EducationForm = {
  school: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: [''],
};

export function EducationTab({ userId }: EducationTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createEducation, { loading: creating }] = useCreateEducation();
  const [updateEducation, { loading: updating }] = useUpdateEducation();
  const [deleteEducation] = useDeleteEducation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EducationForm>(emptyForm);

  const education = data?.getPublicProfile?.education ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (edu: {
      id: string;
      school: string;
      degree?: string | null;
      field?: string | null;
      startDate: string;
      endDate?: string | null;
      description: string[];
    }) => {
      setForm({
        school: edu.school,
        degree: edu.degree ?? '',
        field: edu.field ?? '',
        startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
        description: edu.description.length > 0 ? [...edu.description] : [''],
      });
      setEditingId(edu.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const filteredDesc = form.description.filter((d) => d.trim() !== '');
    const input = {
      school: form.school,
      degree: form.degree || undefined,
      field: form.field || undefined,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      description: filteredDesc.length > 0 ? filteredDesc : undefined,
    };

    if (editingId) {
      await updateEducation({ variables: { id: editingId, input } });
    } else {
      await createEducation({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createEducation, updateEducation]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteEducation({ variables: { id } });
    },
    [deleteEducation],
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
        <p className="text-sm text-[#787774]">{education.length} education(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Education
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Education' : 'New Education'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, school: v }))}>
              <Label>School</Label>
              <Input value={form.school} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, degree: v }))}>
              <Label>Degree</Label>
              <Input value={form.degree} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, field: v }))}>
              <Label>Field of Study</Label>
              <Input value={form.field} />
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
              isDisabled={!form.school || !form.startDate}
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

      {education.map((edu) => (
        <Card key={edu.id}>
          <Card.Content>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[#37352f]">{edu.school}</h3>
                {(edu.degree || edu.field) && (
                  <p className="text-sm text-[#37352f]">
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  </p>
                )}
                <span className="mt-1 text-xs text-[#a3a29e]">
                  {new Date(edu.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' - '}
                  {edu.endDate
                    ? new Date(edu.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Present'}
                </span>
                {edu.description.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 space-y-0.5">
                    {edu.description.map((item, i) => (
                      <li key={i} className="text-sm text-[#37352f] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(edu)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="danger-soft"
                  size="sm"
                  onPress={() => handleDelete(edu.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}

      {education.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <GraduationCap className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No education yet. Add your academic background to showcase your qualifications.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

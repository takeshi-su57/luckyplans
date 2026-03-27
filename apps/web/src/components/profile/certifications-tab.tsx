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
import { Award, ExternalLink, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateCertification } from '@/hooks/use-create-certification';
import { useUpdateCertification } from '@/hooks/use-update-certification';
import { useDeleteCertification } from '@/hooks/use-delete-certification';

interface CertificationsTabProps {
  userId: string;
}

interface CertificationForm {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  url: string;
}

const emptyForm: CertificationForm = {
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  url: '',
};

export function CertificationsTab({ userId }: CertificationsTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createCertification, { loading: creating }] = useCreateCertification();
  const [updateCertification, { loading: updating }] = useUpdateCertification();
  const [deleteCertification] = useDeleteCertification();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertificationForm>(emptyForm);

  const certifications = data?.getPublicProfile?.certifications ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (cert: {
      id: string;
      name: string;
      issuer: string;
      issueDate?: string | null;
      expiryDate?: string | null;
      url?: string | null;
    }) => {
      setForm({
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.issueDate
          ? new Date(cert.issueDate).toISOString().split('T')[0]
          : '',
        expiryDate: cert.expiryDate
          ? new Date(cert.expiryDate).toISOString().split('T')[0]
          : '',
        url: cert.url ?? '',
      });
      setEditingId(cert.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      name: form.name,
      issuer: form.issuer,
      issueDate: form.issueDate || undefined,
      expiryDate: form.expiryDate || undefined,
      url: form.url || undefined,
    };

    if (editingId) {
      await updateCertification({ variables: { id: editingId, input } });
    } else {
      await createCertification({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createCertification, updateCertification]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCertification({ variables: { id } });
    },
    [deleteCertification],
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
        <p className="text-sm text-[#787774]">{certifications.length} certification(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Certification
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>
              {editingId ? 'Edit Certification' : 'New Certification'}
            </Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, name: v }))}>
              <Label>Name</Label>
              <Input value={form.name} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, issuer: v }))}>
              <Label>Issuer</Label>
              <Input value={form.issuer} />
            </TextField>
            <div className="grid grid-cols-2 gap-3">
              <TextField onChange={(v) => setForm((f) => ({ ...f, issueDate: v }))}>
                <Label>Issue Date</Label>
                <Input type="date" value={form.issueDate} />
              </TextField>
              <TextField onChange={(v) => setForm((f) => ({ ...f, expiryDate: v }))}>
                <Label>Expiry Date</Label>
                <Input type="date" value={form.expiryDate} />
              </TextField>
            </div>
            <TextField onChange={(v) => setForm((f) => ({ ...f, url: v }))}>
              <Label>URL</Label>
              <Input placeholder="https://" value={form.url} />
            </TextField>
          </Card.Content>
          <Card.Footer className="gap-2">
            <Button
              isPending={creating || updating}
              isDisabled={!form.name || !form.issuer}
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

      {certifications.map((cert) => (
        <Card key={cert.id}>
          <Card.Content>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[#37352f]">{cert.name}</h3>
                <p className="text-sm text-[#37352f]">{cert.issuer}</p>
                {(cert.issueDate || cert.expiryDate) && (
                  <span className="mt-1 text-xs text-[#a3a29e]">
                    {cert.issueDate
                      ? new Date(cert.issueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                    {cert.issueDate && cert.expiryDate ? ' - ' : ''}
                    {cert.expiryDate
                      ? new Date(cert.expiryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                  </span>
                )}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#0b6e99] hover:text-[#0b6e99]"
                  >
                    <ExternalLink className="size-3" /> View Credential
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(cert)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="danger-soft"
                  size="sm"
                  onPress={() => handleDelete(cert.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}

      {certifications.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <Award className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No certifications yet. Add your professional certifications and credentials.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

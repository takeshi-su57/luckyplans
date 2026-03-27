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
} from '@heroui/react';
import { FolderOpen, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateProject } from '@/hooks/use-create-project';
import { useUpdateProject } from '@/hooks/use-update-project';
import { useDeleteProject } from '@/hooks/use-delete-project';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';

interface ProjectsTabProps {
  userId: string;
}

interface ProjectForm {
  title: string;
  description: string;
  images: string[];
  liveUrl: string;
  repoUrl: string;
  tags: string;
}

const emptyForm: ProjectForm = {
  title: '',
  description: '',
  images: [],
  liveUrl: '',
  repoUrl: '',
  tags: '',
};

export function ProjectsTab({ userId }: ProjectsTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createProject, { loading: creating }] = useCreateProject();
  const [updateProject, { loading: updating }] = useUpdateProject();
  const [deleteProject] = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const projects = data?.getPublicProfile?.projects ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }, []);

  const startEdit = useCallback(
    (project: {
      id: string;
      title: string;
      description?: string | null;
      images: string[];
      liveUrl?: string | null;
      repoUrl?: string | null;
      tags: string[];
    }) => {
      setForm({
        title: project.title,
        description: project.description ?? '',
        images: [...project.images],
        liveUrl: project.liveUrl ?? '',
        repoUrl: project.repoUrl ?? '',
        tags: project.tags.join(', '),
      });
      setEditingId(project.id);
      setShowForm(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      title: form.title,
      description: form.description || undefined,
      images: form.images.length > 0 ? form.images : undefined,
      liveUrl: form.liveUrl || undefined,
      repoUrl: form.repoUrl || undefined,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await updateProject({ variables: { id: editingId, input } });
    } else {
      await createProject({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createProject, updateProject]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProject({ variables: { id } });
    },
    [deleteProject],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#787774]">{projects.length} project(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Project
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Project' : 'New Project'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, title: v }))}>
              <Label>Title *</Label>
              <Input value={form.title} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, description: v }))}>
              <Label>Description</Label>
              <Input value={form.description} />
            </TextField>
            <div>
              <span className="text-xs text-[#787774]">Images</span>
              <MultiImageUpload
                value={form.images}
                onChange={(v) => setForm((f) => ({ ...f, images: v }))}
                prefix="projects"
              />
            </div>
            <TextField onChange={(v) => setForm((f) => ({ ...f, liveUrl: v }))}>
              <Label>Live URL</Label>
              <Input value={form.liveUrl} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, repoUrl: v }))}>
              <Label>Repo URL</Label>
              <Input value={form.repoUrl} />
            </TextField>
            <TextField onChange={(v) => setForm((f) => ({ ...f, tags: v }))}>
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} />
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

      {projects.map((project) => (
        <Card key={project.id}>
          <Card.Content>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-[#37352f]">{project.title}</h3>
                {project.description && (
                  <p className="mt-1 text-sm text-[#37352f]">{project.description}</p>
                )}
                {project.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Chip key={tag} size="sm">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(project)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="danger-soft"
                  size="sm"
                  onPress={() => handleDelete(project.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}

      {projects.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <FolderOpen className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No projects yet. Add your first project to showcase your work.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

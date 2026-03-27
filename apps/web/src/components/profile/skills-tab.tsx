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
import { Code, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { useCreateSkill } from '@/hooks/use-create-skill';
import { useUpdateSkill } from '@/hooks/use-update-skill';
import { useDeleteSkill } from '@/hooks/use-delete-skill';
import { useSkillCategories } from '@/hooks/use-skill-categories';
import { useCreateSkillCategory } from '@/hooks/use-create-skill-category';
import type { Proficiency } from '@/generated/graphql';

interface SkillsTabProps {
  userId: string;
}

const PROFICIENCY_OPTIONS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

interface SkillForm {
  name: string;
  categoryId: string;
  proficiency: string;
}

const emptyForm: SkillForm = {
  name: '',
  categoryId: '',
  proficiency: 'INTERMEDIATE',
};

export function SkillsTab({ userId }: SkillsTabProps) {
  const { data, loading } = usePublicProfile(userId);
  const [createSkill, { loading: creating }] = useCreateSkill();
  const [updateSkill, { loading: updating }] = useUpdateSkill();
  const [deleteSkill] = useDeleteSkill();
  const { data: categoriesData } = useSkillCategories();
  const [createSkillCategory, { loading: creatingCategory }] = useCreateSkillCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const skills = data?.getPublicProfile?.skills ?? [];
  const categories = categoriesData?.getSkillCategories ?? [];

  const startCreate = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setShowNewCategory(false);
  }, []);

  const startEdit = useCallback(
    (skill: { id: string; name: string; categoryId?: string | null; proficiency: string }) => {
      setForm({
        name: skill.name,
        categoryId: skill.categoryId ?? '',
        proficiency: skill.proficiency,
      });
      setEditingId(skill.id);
      setShowForm(true);
      setShowNewCategory(false);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const input = {
      name: form.name,
      categoryId: form.categoryId || undefined,
      proficiency: (form.proficiency as Proficiency) || undefined,
    };

    if (editingId) {
      await updateSkill({ variables: { id: editingId, input } });
    } else {
      await createSkill({ variables: { input } });
    }
    setShowForm(false);
    setEditingId(null);
  }, [form, editingId, createSkill, updateSkill]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteSkill({ variables: { id } });
    },
    [deleteSkill],
  );

  const handleCreateCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    const result = await createSkillCategory({
      variables: { input: { name: newCategoryName.trim() } },
    });
    const newId = result.data?.createSkillCategory?.id;
    if (newId) {
      setForm((f) => ({ ...f, categoryId: newId }));
    }
    setNewCategoryName('');
    setShowNewCategory(false);
  }, [newCategoryName, createSkillCategory]);

  const handleCategorySelectChange = useCallback(
    (key: string | number) => {
      const value = String(key);
      if (value === '__new__') {
        setShowNewCategory(true);
      } else {
        setForm((f) => ({ ...f, categoryId: value }));
        setShowNewCategory(false);
      }
    },
    [],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#787774]">{skills.length} skill(s)</p>
        <Button onPress={startCreate}>
          <Plus className="size-4" /> Add Skill
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#0b6e99] bg-[#d3e5ef]">
          <Card.Header>
            <Card.Title>{editingId ? 'Edit Skill' : 'New Skill'}</Card.Title>
          </Card.Header>
          <Card.Content className="gap-3">
            <TextField onChange={(v) => setForm((f) => ({ ...f, name: v }))}>
              <Label>Name</Label>
              <Input value={form.name} />
            </TextField>
            <Select
              placeholder="No category"
              selectedKey={showNewCategory ? '__new__' : form.categoryId || null}
              onSelectionChange={(key) => handleCategorySelectChange(key as string)}
            >
              <Label>Category</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="" textValue="No category">
                    No category
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.id} id={cat.id} textValue={cat.name}>
                      {cat.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                  <ListBox.Item id="__new__" textValue="Create new...">
                    Create new...
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            {showNewCategory && (
              <div className="flex items-end gap-2">
                <TextField
                  className="flex-1"
                  onChange={(v) => setNewCategoryName(v)}
                >
                  <Label>New Category</Label>
                  <Input placeholder="New category name" value={newCategoryName} />
                </TextField>
                <Button
                  isDisabled={!newCategoryName.trim() || creatingCategory}
                  onPress={handleCreateCategory}
                >
                  {creatingCategory ? 'Adding...' : 'Add'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setShowNewCategory(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
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
                  {PROFICIENCY_OPTIONS.map((opt) => (
                    <ListBox.Item key={opt} id={opt} textValue={opt.charAt(0) + opt.slice(1).toLowerCase()}>
                      {opt.charAt(0) + opt.slice(1).toLowerCase()}
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

      {skills.map((skill) => (
        <Card key={skill.id}>
          <Card.Content>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#37352f]">{skill.name}</span>
                {skill.category?.name && (
                  <Chip size="sm">{skill.category.name}</Chip>
                )}
                <Chip size="sm" color="success">
                  {skill.proficiency.charAt(0) + skill.proficiency.slice(1).toLowerCase()}
                </Chip>
              </div>
              <div className="flex gap-2">
                <Button isIconOnly variant="ghost" size="sm" onPress={() => startEdit(skill)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  isIconOnly
                  variant="danger-soft"
                  size="sm"
                  onPress={() => handleDelete(skill.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}

      {skills.length === 0 && !showForm && (
        <Card className="border border-dashed border-[#e8e7e4]">
          <Card.Content className="flex flex-col items-center gap-3 py-12">
            <Code className="size-10 text-[#a3a29e]" />
            <p className="text-sm text-[#a3a29e]">
              No skills yet. Add your skills to showcase your expertise.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

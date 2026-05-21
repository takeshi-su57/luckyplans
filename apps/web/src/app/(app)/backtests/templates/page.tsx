'use client';

import { FormEvent, useState } from 'react';
import { useCreateTemplate } from '@/hooks/backtests/use-backtests';

export default function BacktestTemplatesPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [factoryConfig, setFactoryConfig] = useState('{"entry":"ema-cross"}');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createTemplate, { loading, data, error }] = useCreateTemplate();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    let parsedFactoryConfig: unknown;

    try {
      parsedFactoryConfig = JSON.parse(factoryConfig);
      setValidationError(null);
    } catch {
      setValidationError('Factory config must be valid JSON.');
      return;
    }

    await createTemplate({
      variables: {
        input: {
          name: name.trim(),
          category: category.trim() || null,
          factoryConfig: parsedFactoryConfig,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Strategy Templates</h1>
        <p className="text-sm text-[#6b7280]">Create reusable strategy templates for backtests.</p>
      </div>

      <form
        className="space-y-3 rounded-lg border border-[#e5e7eb] bg-white p-4"
        onSubmit={onSubmit}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name"
          className="w-full rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        />
        <textarea
          value={factoryConfig}
          onChange={(e) => setFactoryConfig(e.target.value)}
          rows={5}
          className="w-full rounded-md border border-[#d1d5db] px-3 py-2 font-mono text-xs"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#111827] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Template'}
        </button>
      </form>

      {data?.createStrategyTemplate ? (
        <p className="text-sm text-green-700">Created: {data.createStrategyTemplate.name}</p>
      ) : null}
      {validationError ? <p className="text-sm text-red-600">{validationError}</p> : null}
      {error ? <p className="text-sm text-red-600">Template creation failed.</p> : null}
    </div>
  );
}

'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  useBacktestTasks,
  useCancelTask,
  useCreateTask,
  useRetryTask,
} from '@/hooks/backtests/use-backtests';

type Task = {
  id: string;
  name: string;
  symbol: string;
  interval: string;
  status: string;
  assignedWorkerId?: string | null;
  processedConfigs?: number | null;
  totalConfigs?: number | null;
};

export default function BacktestTasksPage() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const [assignedWorkerId, setAssignedWorkerId] = useState('');

  const { data, loading, error, refetch } = useBacktestTasks();
  const [createTask, { loading: creating }] = useCreateTask();
  const [cancelTask, { loading: cancelling }] = useCancelTask();
  const [retryTask, { loading: retrying }] = useRetryTask();

  const tasks = useMemo(() => (data?.backtestTasks ?? []) as Task[], [data?.backtestTasks]);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    await createTask({
      variables: {
        input: {
          name: name.trim(),
          symbol: symbol.trim(),
          interval: interval.trim(),
          assignedWorkerId: assignedWorkerId.trim(),
          searchStrategy: 'grid',
        },
      },
    });
    await refetch();
  };

  const onCancel = async (taskId: string) => {
    await cancelTask({ variables: { taskId } });
    await refetch();
  };

  const onRetry = async (taskId: string) => {
    await retryTask({ variables: { taskId } });
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Backtest Tasks</h1>
        <p className="text-sm text-[#6b7280]">Create and manage assigned edge backtest tasks.</p>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-[#e5e7eb] bg-white p-4 sm:grid-cols-5"
        onSubmit={onCreate}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task name"
          className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        />
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol"
          className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        />
        <input
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          placeholder="Interval"
          className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        />
        <input
          value={assignedWorkerId}
          onChange={(e) => setAssignedWorkerId(e.target.value)}
          placeholder="Assigned worker id"
          className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={creating}
          className="rounded-md bg-[#111827] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create Task'}
        </button>
      </form>

      <section className="space-y-3 rounded-lg border border-[#e5e7eb] bg-white p-4">
        {loading ? <p className="text-sm text-[#6b7280]">Loading tasks...</p> : null}
        {error ? <p className="text-sm text-red-600">Failed to load tasks.</p> : null}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col justify-between gap-3 rounded-md border border-[#e5e7eb] p-3 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <p className="font-medium text-[#111827]">{task.name}</p>
              <p className="text-xs text-[#6b7280]">
                {task.symbol} | {task.interval} | {task.status} | worker{' '}
                {task.assignedWorkerId ?? 'none'}
              </p>
              <p className="text-xs text-[#9ca3af]">
                Progress: {task.processedConfigs ?? 0} / {task.totalConfigs ?? 0}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onCancel(task.id)}
                disabled={cancelling}
                className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onRetry(task.id)}
                disabled={retrying}
                className="rounded-md border border-blue-200 px-3 py-1 text-sm text-blue-700 disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

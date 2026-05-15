'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const WorkersQuery = gql`
  query Workers {
    workers {
      id
      name
      platform
      version
      status
      lastSeenAt
      createdAt
      updatedAt
    }
  }
`;

const CreateWorkerMutation = gql`
  mutation CreateWorker($name: String!, $platform: String, $version: String) {
    createWorker(name: $name, platform: $platform, version: $version) {
      id
      name
      platform
      version
      status
      lastSeenAt
      createdAt
      updatedAt
    }
  }
`;

const DisableWorkerMutation = gql`
  mutation DisableWorker($id: String!) {
    disableWorker(id: $id) {
      id
      status
    }
  }
`;

type Worker = {
  id: string;
  name: string;
  platform?: string | null;
  version?: string | null;
  status: 'ACTIVE' | 'DISABLED';
  lastSeenAt?: string | null;
  createdAt: string;
};

type WorkersQueryData = {
  workers: Worker[];
};

export default function EdgesPage() {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [version, setVersion] = useState('');

  const { data, loading, refetch } = useQuery<WorkersQueryData>(WorkersQuery);
  const [createWorker, { loading: creating }] = useMutation(CreateWorkerMutation);
  const [disableWorker, { loading: disabling }] = useMutation(DisableWorkerMutation);

  const workers = useMemo(() => data?.workers ?? [], [data?.workers]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createWorker({
      variables: {
        name: name.trim(),
        platform: platform.trim() || null,
        version: version.trim() || null,
      },
    });

    setName('');
    setPlatform('');
    setVersion('');
    await refetch();
  };

  const onDisable = async (id: string) => {
    await disableWorker({ variables: { id } });
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Edges</h1>
        <p className="text-sm text-[#6b7280]">
          Register edge clients and manage their availability for future task assignment.
        </p>
      </div>

      <section className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <h2 className="mb-3 font-medium text-[#111827]">Register New Edge</h2>
        <form className="grid gap-3 sm:grid-cols-4" onSubmit={onSubmit}>
          <input
            required
            placeholder="Name (edge-seoul-01)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <input
            placeholder="Platform (windows-x64)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <input
            placeholder="Version (0.1.0)"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="rounded-md bg-[#111827] px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              {creating ? 'Registering...' : 'Register Edge'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <h2 className="mb-3 font-medium text-[#111827]">Registered Edges</h2>
        <div className="space-y-3">
          {loading ? <p className="text-sm text-[#6b7280]">Loading edges...</p> : null}
          {!loading && workers.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No edges registered yet.</p>
          ) : null}
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-[#e5e7eb] p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <p className="font-medium text-[#111827]">{worker.name}</p>
                <p className="text-xs text-[#6b7280]">
                  {worker.platform ?? 'unknown platform'} | {worker.version ?? 'no version'}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  Created: {new Date(worker.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    worker.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {worker.status}
                </span>
                <button
                  type="button"
                  disabled={worker.status === 'DISABLED' || disabling}
                  onClick={() => onDisable(worker.id)}
                  className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 disabled:opacity-50"
                >
                  {disabling ? 'Disabling...' : 'Disable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

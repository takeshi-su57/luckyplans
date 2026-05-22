'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const WorkersQuery = gql`
  query Workers {
    workers {
      id
      name
      deviceNumber
      platform
      version
      status
      lastSeenAt
      hasActiveCredential
      targetVersion
      upgradeStatus
      upgradeMessage
      createdAt
      updatedAt
    }
    edgeEnrollmentTokens {
      id
      label
      tokenPrefix
      status
      expiresAt
      maxUses
      usedCount
      lastUsedAt
      revokedAt
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

const SetWorkerTargetVersionMutation = gql`
  mutation SetWorkerTargetVersion($workerIds: [String!]!, $targetVersion: String!) {
    setWorkerTargetVersion(workerIds: $workerIds, targetVersion: $targetVersion)
  }
`;

const IssueWorkerCredentialMutation = gql`
  mutation IssueWorkerCredential($id: String!) {
    issueWorkerCredential(id: $id) {
      id
      workerId
      keyPrefix
      credential
    }
  }
`;

const RotateWorkerCredentialMutation = gql`
  mutation RotateWorkerCredential($id: String!) {
    rotateWorkerCredential(id: $id) {
      id
      workerId
      keyPrefix
      credential
    }
  }
`;

const RevokeWorkerCredentialMutation = gql`
  mutation RevokeWorkerCredential($id: String!) {
    revokeWorkerCredential(id: $id)
  }
`;

const CreateEdgeEnrollmentTokenMutation = gql`
  mutation CreateEdgeEnrollmentToken($label: String, $maxUses: Int, $expiresAt: DateTime) {
    createEdgeEnrollmentToken(label: $label, maxUses: $maxUses, expiresAt: $expiresAt) {
      id
      label
      tokenPrefix
      status
      maxUses
      usedCount
      expiresAt
      token
      createdAt
      updatedAt
    }
  }
`;

const RevokeEdgeEnrollmentTokenMutation = gql`
  mutation RevokeEdgeEnrollmentToken($id: String!) {
    revokeEdgeEnrollmentToken(id: $id)
  }
`;

type Worker = {
  id: string;
  name: string;
  deviceNumber?: string | null;
  platform?: string | null;
  version?: string | null;
  status: 'ACTIVE' | 'DISABLED';
  hasActiveCredential?: boolean | null;
  targetVersion?: string | null;
  upgradeStatus:
    | 'IDLE'
    | 'UPGRADE_PENDING'
    | 'DOWNLOADING'
    | 'VERIFYING'
    | 'RESTARTING'
    | 'SUCCEEDED'
    | 'FAILED'
    | 'ROLLED_BACK';
  upgradeMessage?: string | null;
  lastSeenAt?: string | null;
  createdAt: string;
};

type WorkersQueryData = {
  workers: Worker[];
  edgeEnrollmentTokens: EnrollmentToken[];
};

type EnrollmentToken = {
  id: string;
  label?: string | null;
  tokenPrefix: string;
  status: 'ACTIVE' | 'REVOKED';
  expiresAt?: string | null;
  maxUses?: number | null;
  usedCount: number;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type WorkerCredentialPayload = {
  id: string;
  workerId: string;
  keyPrefix: string;
  credential: string;
};

type IssueWorkerCredentialMutationData = {
  issueWorkerCredential: WorkerCredentialPayload;
};

type IssueWorkerCredentialMutationVariables = {
  id: string;
};

type RotateWorkerCredentialMutationData = {
  rotateWorkerCredential: WorkerCredentialPayload;
};

type RotateWorkerCredentialMutationVariables = {
  id: string;
};

type CreateEdgeEnrollmentTokenMutationData = {
  createEdgeEnrollmentToken: {
    id: string;
    label?: string | null;
    tokenPrefix: string;
    status: 'ACTIVE' | 'REVOKED';
    maxUses?: number | null;
    usedCount: number;
    expiresAt?: string | null;
    token: string;
    createdAt: string;
    updatedAt: string;
  };
};

type CreateEdgeEnrollmentTokenMutationVariables = {
  label?: string | null;
  maxUses?: number | null;
  expiresAt?: string | null;
};

type RevokeEdgeEnrollmentTokenMutationData = {
  revokeEdgeEnrollmentToken: boolean;
};

type RevokeEdgeEnrollmentTokenMutationVariables = {
  id: string;
};

export default function EdgesPage() {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [version, setVersion] = useState('');
  const [targetVersionByWorker, setTargetVersionByWorker] = useState<Record<string, string>>({});
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [revealedCredential, setRevealedCredential] = useState<string | null>(null);
  const [revealedWorkerId, setRevealedWorkerId] = useState<string | null>(null);
  const [showCredentialValue, setShowCredentialValue] = useState(false);
  const [enrollmentLabel, setEnrollmentLabel] = useState('');
  const [enrollmentMaxUses, setEnrollmentMaxUses] = useState('');
  const [enrollmentExpiresAt, setEnrollmentExpiresAt] = useState('');
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [revealedEnrollmentToken, setRevealedEnrollmentToken] = useState<string | null>(null);
  const [showEnrollmentValue, setShowEnrollmentValue] = useState(false);

  const { data, loading, error, refetch } = useQuery<WorkersQueryData>(WorkersQuery);
  const [createWorker, { loading: creating }] = useMutation(CreateWorkerMutation);
  const [disableWorker, { loading: disabling }] = useMutation(DisableWorkerMutation);
  const [setWorkerTargetVersion, { loading: settingTargetVersion }] = useMutation(
    SetWorkerTargetVersionMutation,
  );
  const [issueWorkerCredential, { loading: issuingCredential }] = useMutation<
    IssueWorkerCredentialMutationData,
    IssueWorkerCredentialMutationVariables
  >(IssueWorkerCredentialMutation);
  const [rotateWorkerCredential, { loading: rotatingCredential }] = useMutation<
    RotateWorkerCredentialMutationData,
    RotateWorkerCredentialMutationVariables
  >(RotateWorkerCredentialMutation);
  const [revokeWorkerCredential, { loading: revokingCredential }] = useMutation(
    RevokeWorkerCredentialMutation,
  );
  const [createEdgeEnrollmentToken, { loading: creatingEnrollmentToken }] = useMutation<
    CreateEdgeEnrollmentTokenMutationData,
    CreateEdgeEnrollmentTokenMutationVariables
  >(CreateEdgeEnrollmentTokenMutation);
  const [revokeEdgeEnrollmentToken, { loading: revokingEnrollmentToken }] = useMutation<
    RevokeEdgeEnrollmentTokenMutationData,
    RevokeEdgeEnrollmentTokenMutationVariables
  >(RevokeEdgeEnrollmentTokenMutation);

  const workers = useMemo(() => data?.workers ?? [], [data?.workers]);
  const enrollmentTokens = useMemo(
    () => data?.edgeEnrollmentTokens ?? [],
    [data?.edgeEnrollmentTokens],
  );

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

  const onSetTargetVersion = async (workerId: string) => {
    const targetVersion = targetVersionByWorker[workerId]?.trim();
    if (!targetVersion) return;

    await setWorkerTargetVersion({
      variables: {
        workerIds: [workerId],
        targetVersion,
      },
    });
    await refetch();
  };

  const openCredentialModal = (workerId: string, credential: string) => {
    setRevealedWorkerId(workerId);
    setRevealedCredential(credential);
    setShowCredentialValue(false);
    setCredentialModalOpen(true);
  };

  const closeCredentialModal = () => {
    setCredentialModalOpen(false);
    setRevealedWorkerId(null);
    setRevealedCredential(null);
    setShowCredentialValue(false);
  };

  const onIssueCredential = async (workerId: string) => {
    const result = await issueWorkerCredential({ variables: { id: workerId } });
    const credential = result.data?.issueWorkerCredential?.credential;
    if (credential) openCredentialModal(workerId, credential);
    await refetch();
  };

  const onRotateCredential = async (workerId: string) => {
    const result = await rotateWorkerCredential({ variables: { id: workerId } });
    const credential = result.data?.rotateWorkerCredential?.credential;
    if (credential) openCredentialModal(workerId, credential);
    await refetch();
  };

  const onRevokeCredential = async (workerId: string) => {
    const confirmed = window.confirm('Revoke active credential for this edge?');
    if (!confirmed) return;
    await revokeWorkerCredential({ variables: { id: workerId } });
    await refetch();
  };

  const onCreateEnrollmentToken = async (e: FormEvent) => {
    e.preventDefault();
    const maxUses = enrollmentMaxUses.trim() ? Number(enrollmentMaxUses.trim()) : null;
    const expiresAtIso = enrollmentExpiresAt.trim()
      ? new Date(enrollmentExpiresAt.trim()).toISOString()
      : null;
    const result = await createEdgeEnrollmentToken({
      variables: {
        label: enrollmentLabel.trim() || null,
        maxUses: Number.isFinite(maxUses as number) ? maxUses : null,
        expiresAt: expiresAtIso,
      },
    });
    const token = result.data?.createEdgeEnrollmentToken?.token;
    if (token) {
      setRevealedEnrollmentToken(token);
      setEnrollmentModalOpen(true);
      setShowEnrollmentValue(false);
    }
    setEnrollmentLabel('');
    setEnrollmentMaxUses('');
    setEnrollmentExpiresAt('');
    await refetch();
  };

  const onRevokeEnrollmentToken = async (id: string) => {
    const confirmed = window.confirm(
      'Revoke this enrollment token? New edge registration will fail.',
    );
    if (!confirmed) return;
    await revokeEdgeEnrollmentToken({ variables: { id } });
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
        <h2 className="mb-3 font-medium text-[#111827]">Edge Enrollment Tokens</h2>
        <p className="mb-3 text-xs text-[#6b7280]">
          Use enrollment tokens only for first-time edge registration. Existing registered edges use
          their own worker credentials.
        </p>
        <form className="grid gap-3 sm:grid-cols-4" onSubmit={onCreateEnrollmentToken}>
          <input
            placeholder="Label (optional)"
            value={enrollmentLabel}
            onChange={(e) => setEnrollmentLabel(e.target.value)}
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <input
            placeholder="Max uses (optional)"
            value={enrollmentMaxUses}
            onChange={(e) => setEnrollmentMaxUses(e.target.value)}
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={enrollmentExpiresAt}
            onChange={(e) => setEnrollmentExpiresAt(e.target.value)}
            className="rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
          />
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creatingEnrollmentToken}
              className="rounded-md bg-[#111827] px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              {creatingEnrollmentToken ? 'Creating...' : 'Create Enrollment Token'}
            </button>
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {enrollmentTokens.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No enrollment tokens yet.</p>
          ) : null}
          {enrollmentTokens.map((token) => (
            <div
              key={token.id}
              className="flex flex-col justify-between gap-2 rounded-lg border border-[#e5e7eb] p-3 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <p className="font-medium text-[#111827]">
                  {token.label?.trim() ? token.label : token.tokenPrefix}
                </p>
                <p className="text-xs text-[#6b7280]">
                  Prefix: {token.tokenPrefix} | Uses: {token.usedCount}
                  {token.maxUses ? `/${token.maxUses}` : ' (unlimited)'}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  Expires: {token.expiresAt ? new Date(token.expiresAt).toLocaleString() : 'Never'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    token.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {token.status}
                </span>
                <button
                  type="button"
                  disabled={token.status !== 'ACTIVE' || revokingEnrollmentToken}
                  onClick={() => onRevokeEnrollmentToken(token.id)}
                  className="rounded-md border border-rose-200 px-3 py-1 text-sm text-rose-700 disabled:opacity-50"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#e5e7eb] bg-white p-4">
        <h2 className="mb-3 font-medium text-[#111827]">Registered Edges</h2>
        <div className="space-y-3">
          {loading ? <p className="text-sm text-[#6b7280]">Loading edges...</p> : null}
          {error ? (
            <p className="text-sm text-red-600">Failed to load edges. Please try again.</p>
          ) : null}
          {!loading && workers.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No edges registered yet.</p>
          ) : null}
          {workers.map((worker) => {
            const lastSeen = worker.lastSeenAt
              ? new Date(worker.lastSeenAt).toLocaleString()
              : 'Never seen';

            return (
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
                    Device Number: {worker.deviceNumber ?? 'N/A'}
                  </p>
                  <p className="text-xs text-[#9ca3af]">Connectivity (Last Seen): {lastSeen}</p>
                  <p className="text-xs text-[#9ca3af]">
                    Current Version: {worker.version ?? 'N/A'}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    Target Version: {worker.targetVersion ?? 'Not set'}
                  </p>
                  <p className="text-xs text-[#9ca3af]">Upgrade Status: {worker.upgradeStatus}</p>
                  <p className="text-xs text-[#9ca3af]">
                    Credential: {worker.hasActiveCredential ? 'Active' : 'None'}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    Created: {new Date(worker.createdAt).toLocaleString()}
                  </p>
                  {worker.upgradeMessage ? (
                    <p className="text-xs text-[#9ca3af]">Message: {worker.upgradeMessage}</p>
                  ) : null}
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
                  <input
                    placeholder="Target version (1.0.1)"
                    value={targetVersionByWorker[worker.id] ?? ''}
                    onChange={(e) =>
                      setTargetVersionByWorker((prev) => ({ ...prev, [worker.id]: e.target.value }))
                    }
                    className="rounded-md border border-[#d1d5db] px-2 py-1 text-xs"
                  />
                  <button
                    type="button"
                    disabled={settingTargetVersion}
                    onClick={() => onSetTargetVersion(worker.id)}
                    className="rounded-md border border-blue-200 px-3 py-1 text-sm text-blue-700 disabled:opacity-50"
                  >
                    Set Target
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(worker.hasActiveCredential) || issuingCredential}
                    onClick={() => onIssueCredential(worker.id)}
                    className="rounded-md border border-emerald-200 px-3 py-1 text-sm text-emerald-700 disabled:opacity-50"
                  >
                    Issue
                  </button>
                  <button
                    type="button"
                    disabled={!worker.hasActiveCredential || rotatingCredential}
                    onClick={() => onRotateCredential(worker.id)}
                    className="rounded-md border border-amber-200 px-3 py-1 text-sm text-amber-700 disabled:opacity-50"
                  >
                    Rotate
                  </button>
                  <button
                    type="button"
                    disabled={!worker.hasActiveCredential || revokingCredential}
                    onClick={() => onRevokeCredential(worker.id)}
                    className="rounded-md border border-rose-200 px-3 py-1 text-sm text-rose-700 disabled:opacity-50"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {credentialModalOpen && revealedCredential ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#111827]">Worker Credential (Show Once)</h3>
            <p className="mt-1 text-sm text-[#6b7280]">
              Save this token now. It will not be shown again after you close this dialog.
            </p>
            <p className="mt-2 text-xs text-[#9ca3af]">Worker ID: {revealedWorkerId}</p>
            <div className="mt-3 rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3 font-mono text-xs">
              {showCredentialValue ? revealedCredential : '••••••••••••••••••••••••••••••••'}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCredentialValue((prev) => !prev)}
                className="rounded-md border border-[#d1d5db] px-3 py-1 text-sm text-[#374151]"
              >
                {showCredentialValue ? 'Hide Token' : 'Show Token'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(revealedCredential);
                }}
                className="rounded-md border border-[#d1d5db] px-3 py-1 text-sm text-[#374151]"
              >
                Copy Token
              </button>
              <button
                type="button"
                onClick={closeCredentialModal}
                className="ml-auto rounded-md bg-[#111827] px-3 py-1 text-sm text-white"
              >
                Close
              </button>
            </div>
          </div>
        </section>
      ) : null}
      {enrollmentModalOpen && revealedEnrollmentToken ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#111827]">Enrollment Token (Show Once)</h3>
            <p className="mt-1 text-sm text-[#6b7280]">
              Save this token now. It will not be shown again after you close this dialog.
            </p>
            <div className="mt-3 rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3 font-mono text-xs">
              {showEnrollmentValue
                ? revealedEnrollmentToken
                : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEnrollmentValue((prev) => !prev)}
                className="rounded-md border border-[#d1d5db] px-3 py-1 text-sm text-[#374151]"
              >
                {showEnrollmentValue ? 'Hide Token' : 'Show Token'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(revealedEnrollmentToken);
                }}
                className="rounded-md border border-[#d1d5db] px-3 py-1 text-sm text-[#374151]"
              >
                Copy Token
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnrollmentModalOpen(false);
                  setShowEnrollmentValue(false);
                  setRevealedEnrollmentToken(null);
                }}
                className="ml-auto rounded-md bg-[#111827] px-3 py-1 text-sm text-white"
              >
                Close
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

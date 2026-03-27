'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
  value?: string | null;
  onChange: (key: string) => void;
  prefix: string;
}

export function ImageUpload({ value, onChange, prefix }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError('');
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/uploads?prefix=${encodeURIComponent(prefix)}`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Upload failed');
        }

        const { key } = await res.json();
        onChange(key);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [onChange, prefix],
  );

  return (
    <div>
      {value && (
        <div className="mb-2">
          <img
            src={`/uploads/${value}`}
            alt="Preview"
            className="h-20 w-20 rounded-lg border border-[#e8e7e4] object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          isPending={uploading}
          onPress={() => inputRef.current?.click()}
        >
          {({ isPending }) =>
            isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                {value ? 'Change Image' : 'Upload Image'}
              </>
            )
          }
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#e03e3e]">{error}</p>}
    </div>
  );
}

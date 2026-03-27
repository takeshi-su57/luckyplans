'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { Loader2, Play, Upload, X } from 'lucide-react';

function isVideo(key: string): boolean {
  return /\.(mp4|webm)$/i.test(key);
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (keys: string[]) => void;
  prefix: string;
  max?: number;
}

export function MultiImageUpload({ value, onChange, prefix, max = 5 }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const remaining = max - value.length;
      if (remaining <= 0) {
        setError(`Maximum ${max} files allowed`);
        return;
      }

      setError('');
      setUploading(true);

      try {
        const filesToUpload = Array.from(files).slice(0, remaining);
        const newKeys: string[] = [];

        for (const file of filesToUpload) {
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
          newKeys.push(key);
        }

        onChange([...value, ...newKeys]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [onChange, prefix, value, max],
  );

  const removeImage = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [onChange, value],
  );

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {value.map((key, index) => (
            <div key={key} className="relative flex-shrink-0">
              {isVideo(key) ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#e8e7e4]">
                  <video
                    src={`/uploads/${key}`}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="size-5 fill-white text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={`/uploads/${key}`}
                  alt={`File ${index + 1}`}
                  className="h-20 w-20 rounded-lg border border-[#e8e7e4] object-cover"
                />
              )}
              <Button
                variant="danger-soft"
                isIconOnly
                size="sm"
                className="absolute -right-1 -top-1 h-5 w-5 min-w-0 rounded-full"
                onPress={() => removeImage(index)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          isPending={uploading}
          isDisabled={value.length >= max}
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
                {`Add File${value.length > 0 ? ` (${value.length}/${max})` : ''}`}
              </>
            )
          }
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#e03e3e]">{error}</p>}
    </div>
  );
}

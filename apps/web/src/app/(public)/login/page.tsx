'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button, TextField, Label, Input } from '@heroui/react';
import { Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid email or password');
        return;
      }

      router.push(returnTo);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-600 to-emerald-900 p-12 text-white">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/brand.png" alt="LuckyPlans" width={40} height={40} />
            <span className="text-xl font-bold">LuckyPlans</span>
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Build your portfolio
            <br />
            with confidence.
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Showcase your projects, skills, and experience to the world.
          </p>
        </div>
        <p className="text-sm text-white/50">&copy; 2026 LuckyPlans</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo for mobile */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/brand.png" alt="LuckyPlans" width={32} height={32} />
              <span className="text-lg font-bold text-[#37352f]">
                Lucky<span className="text-primary">Plans</span>
              </span>
            </Link>
          </div>

          <h2 className="text-[30px] font-bold text-[#37352f]">Sign in</h2>
          <p className="mt-1 text-sm text-[#787774]">Welcome back to LuckyPlans</p>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg bg-[#ffe2dd] px-4 py-3 text-sm text-[#e03e3e]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <TextField onChange={setEmail}>
              <Label>Email</Label>
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
              />
            </TextField>

            <TextField onChange={setPassword}>
              <Label>Password</Label>
              <Input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
              />
            </TextField>

            <Button
              type="submit"
              isPending={loading}
              className="w-full"
              onPress={() => {}}
            >
              {({ isPending }) =>
                isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  'Log in'
                )
              }
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#787774]">
            Don&apos;t have an account?{' '}
            <Link
              href={`/register?returnTo=${encodeURIComponent(returnTo)}`}
              className="font-medium text-primary hover:text-[#0b6e99]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { assets } from '../../../lib/siteContent';
import { field, fieldLabel } from '../ui';

type AdminLoginProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
};

export default function AdminLogin({ onSubmit }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch (loginError: any) {
      setError(loginError?.message || 'Unable to sign in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary-950 lg:flex lg:w-[45%] lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-600/25 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div className="relative z-10 flex items-center gap-3 p-10">
          <img src={assets.logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-semibold text-white">Beyond Blooming Minds</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-primary-400">Content dashboard</p>
          </div>
        </div>

        <div className="relative z-10 px-10 pb-16">
          <h2 className="max-w-md font-serif text-4xl leading-tight text-white">
            Everything on the site, managed from one place.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-primary-200/80">
            Update page copy, publish books and reflections, and respond to every message and order request.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 px-10 py-6">
          <p className="flex items-center gap-2 text-xs text-white/50">
            <ShieldCheck size={14} />
            Access is restricted to authorised administrators.
          </p>
        </div>
      </div>

      {/* Sign-in panel */}
      <div className="flex w-full items-center justify-center px-6 py-16 lg:w-[55%]">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex justify-center lg:hidden">
            <img src={assets.logo} alt="" className="h-14 w-14 rounded-2xl object-cover" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-500">Sign in to manage your site.</p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className={fieldLabel}>
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={field}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className={fieldLabel}>
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={field + ' pr-11'}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Forgot your password? Reset it from the Supabase dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

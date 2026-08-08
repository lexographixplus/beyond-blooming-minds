import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AtSign, Check, Facebook, Instagram, Loader2, MessageCircle, Music2, RotateCcw } from 'lucide-react';
import { Panel } from '../components/primitives';
import { btnPrimary, btnSecondary, field, fieldHint, fieldLabel } from '../ui';
import type { ContentType } from '../../../types';

type ContentTabProps = {
  content: ContentType;
  loading: boolean;
  onSave: (content: ContentType) => Promise<void>;
};

type FieldSpec = {
  name: keyof ContentType;
  label: string;
  hint?: string;
  rows?: number;
  placeholder?: string;
};

const sections: { title: string; description: string; fields: FieldSpec[] }[] = [
  {
    title: 'Hero section',
    description: 'The first thing visitors read at the top of the home page.',
    fields: [
      { name: 'heroTitle', label: 'Headline', placeholder: 'Growing Minds, Hearts & Spirits' },
      { name: 'heroSubtitle', label: 'Supporting text', rows: 4 },
    ],
  },
  {
    title: 'About section',
    description: 'Your story, vision and mission. Blank lines create paragraphs.',
    fields: [
      { name: 'aboutText', label: 'About text', rows: 8, hint: 'Leave a blank line between paragraphs.' },
      { name: 'visionText', label: 'Vision statement', rows: 3 },
      { name: 'missionText', label: 'Mission statement', rows: 3 },
    ],
  },
  {
    title: 'Founder section',
    description: 'The personal note shown beside the founder photo.',
    fields: [{ name: 'founderNote', label: 'Founder note', rows: 8 }],
  },
];

const contactFields: (FieldSpec & { icon: typeof AtSign; hint: string })[] = [
  {
    name: 'email',
    label: 'Email',
    icon: AtSign,
    placeholder: 'hello@example.com',
    hint: 'Shown in the footer and contact section.',
  },
  {
    name: 'whatsapp',
    label: 'WhatsApp number',
    icon: MessageCircle,
    placeholder: '+220 000 0000',
    hint: 'Powers the floating chat button. Include the country code.',
  },
  {
    name: 'instagram',
    label: 'Instagram handle',
    icon: Instagram,
    placeholder: '@beyondbloomingminds',
    hint: 'With or without the @.',
  },
  {
    name: 'facebook',
    label: 'Facebook handle',
    icon: Facebook,
    placeholder: 'beyondbloomingminds',
    hint: 'With or without the @.',
  },
  {
    name: 'tiktok',
    label: 'TikTok handle',
    icon: Music2,
    placeholder: '@beyondbloomingminds',
    hint: 'With or without the @.',
  },
];

export default function ContentTab({ content, loading, onSave }: ContentTabProps) {
  const [draft, setDraft] = useState<ContentType>(content);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(draft);
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 3000);
    } catch {
      // The caller surfaces the failure as a toast; keep the draft intact.
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel>
        <div className="flex items-center justify-center gap-3 py-12 text-sm text-gray-500">
          <Loader2 size={18} className="animate-spin" />
          Loading website content...
        </div>
      </Panel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {sections.map((section) => (
        <Panel key={section.title} title={section.title} description={section.description}>
          <div className="space-y-5">
            {section.fields.map((spec) => (
              <div key={String(spec.name)}>
                <label htmlFor={String(spec.name)} className={fieldLabel}>
                  {spec.label}
                </label>
                {spec.rows ? (
                  <textarea
                    id={String(spec.name)}
                    name={String(spec.name)}
                    rows={spec.rows}
                    value={draft[spec.name] ?? ''}
                    onChange={handleChange}
                    placeholder={spec.placeholder}
                    className={field + ' resize-y leading-relaxed'}
                  />
                ) : (
                  <input
                    id={String(spec.name)}
                    name={String(spec.name)}
                    type="text"
                    value={draft[spec.name] ?? ''}
                    onChange={handleChange}
                    placeholder={spec.placeholder}
                    className={field}
                  />
                )}
                {spec.hint && <p className={fieldHint}>{spec.hint}</p>}
              </div>
            ))}
          </div>
        </Panel>
      ))}

      <Panel
        title="Contact details"
        description="Used across the footer, contact section and WhatsApp chat button."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {contactFields.map((spec) => (
            <div key={String(spec.name)}>
              <label htmlFor={String(spec.name)} className={fieldLabel}>
                {spec.label}
              </label>
              <div className="relative">
                <spec.icon
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id={String(spec.name)}
                  name={String(spec.name)}
                  type="text"
                  value={draft[spec.name] ?? ''}
                  onChange={handleChange}
                  placeholder={spec.placeholder}
                  className={field + ' pl-9'}
                />
              </div>
              <p className={fieldHint}>{spec.hint}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Sticky save bar — keeps the action reachable in a long form. */}
      <div className="sticky bottom-4 z-30">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur">
          <p className="text-xs text-gray-500">
            {savedAt ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                <Check size={14} />
                Changes saved and live on the site
              </span>
            ) : dirty ? (
              'You have unsaved changes.'
            ) : (
              'Everything is up to date.'
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDraft(content)}
              disabled={!dirty || saving}
              className={btnSecondary}
            >
              <RotateCcw size={15} />
              Discard
            </button>
            <button type="submit" disabled={saving || !dirty} className={btnPrimary}>
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

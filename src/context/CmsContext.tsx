import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { subscribeContent } from '../lib/supabase';
import type { ContentType } from '../types';

const defaultContent: ContentType = {
  heroTitle: 'Growing Minds, Hearts & Spirits',
  heroSubtitle:
    'Supporting mental, emotional, and spiritual wellbeing through holistic care, blending modern psychology with Islamic principles.',
  aboutText:
    'Beyond Blooming Minds supports mental, emotional, and spiritual wellbeing through psycho-education, psycho-social support, holistic care, and advocacy. We work with individuals, families, schools, and youth groups to build resilience, improve emotional health, and strengthen relationships.\n\nOur approach blends evidence-based practices from modern psychology with the principles of Islamic psychology. This means our programs are practical, culturally relevant, and spiritually grounded.\n\nFrom workshops on emotional intelligence and stress management to parenting programs, teacher wellbeing sessions, 1-on-1 support, and community advocacy, everything we do is designed to help people grow in mind, heart, and spirit.',
  visionText:
    'To create a community where individuals and families flourish emotionally, mentally, and spiritually, supported by knowledge, compassion, and holistic care.',
  missionText:
    'To provide accessible psycho-education, psycho-social support, and holistic wellness programs that empower individuals and communities to grow stronger in mind, heart, and spirit.',
  founderNote:
    'I started Beyond Blooming Minds because I saw how many people were struggling silently with their mental and emotional wellbeing, often feeling that their faith and identity weren\'t fully understood in the support they received.\n\nMy goal is to bridge modern psychology with Islamic psychology so individuals, families, and schools can heal and grow in a way that honours both their minds and their spirits.\n\nI believe every person has the capacity to flourish when given the right knowledge, support, and environment. This work is my way of serving the community with sincerity, compassion, and hope.',
  email: 'email@example.com',
  whatsapp: '+1234567890',
  instagram: '@beyondbloomingminds',
};

const CmsContext = createContext<{ content: ContentType; loading: boolean }>({
  content: defaultContent,
  loading: true,
});

export const CmsProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentType>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeContent((data) => {
      if (data) {
        setContent({ ...defaultContent, ...data });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <CmsContext.Provider value={{ content, loading }}>{children}</CmsContext.Provider>;
};

export const useCms = () => useContext(CmsContext);

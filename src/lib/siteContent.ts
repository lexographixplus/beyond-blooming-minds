export const assets = {
  logo: `${import.meta.env.BASE_URL}logo.png`,
  hero: new URL('../../Hero IMG.jpeg', import.meta.url).href,
  psychoeducationOne: new URL('../../IMG 1.jpeg', import.meta.url).href,
  psychoeducationTwo: new URL('../../IMG 2.jpeg', import.meta.url).href,
};

export const defaultBlogIntro =
  'Fresh reflections on psychoeducation, healing, parenting, learning, and holistic wellbeing will appear here when blog posts are published from the dashboard.';

export const heroStats = [
  { label: 'Psychoeducation sessions', value: 'School & community' },
  { label: 'Books and reflections', value: 'Growing collection' },
  { label: 'Order response', value: 'Managed in dashboard' },
];


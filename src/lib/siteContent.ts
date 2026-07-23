export const assets = {
  logo: new URL('../../logo.png', import.meta.url).href,
  hero: new URL('../../Hero IMG.jpeg', import.meta.url).href,
  psychoeducationOne: new URL('../../IMG 1.jpeg', import.meta.url).href,
  psychoeducationTwo: new URL('../../IMG 2.jpeg', import.meta.url).href,
  bookOne: new URL('../../book 1.jpg', import.meta.url).href,
  bookTwo: new URL('../../book 2.jpg', import.meta.url).href,
  upcomingBook: new URL('../../Upcoming Book.jpeg', import.meta.url).href,
};

export const defaultBooks = [
  {
    id: 'featured-book-1',
    title: 'The Radiant Thrivers',
    author: 'Binta Nyangado',
    description:
      'A reflective guide for dismantling toxic dynamics, reclaiming self-worth, and choosing emotional clarity with courage.',
    price: 'Pre-order available',
    cta_label: 'Order Book 1',
    image_url: assets.bookOne,
    featured: true,
    status: 'Available now',
  },
  {
    id: 'featured-book-2',
    title: 'The Fragile Barriers',
    author: 'Binta Nyangado',
    description:
      'A thoughtful book about healing, resilience, and the invisible walls that can hold people back from flourishing.',
    price: 'Pre-order available',
    cta_label: 'Order Book 2',
    image_url: assets.bookTwo,
    featured: true,
    status: 'Available now',
  },
  {
    id: 'upcoming-book',
    title: 'Hands Speak',
    author: 'Binta Nyangado',
    description:
      'An upcoming release exploring deafness, identity, family support, and belonging in education and community life.',
    price: 'Coming soon',
    cta_label: 'Join the waitlist',
    image_url: assets.upcomingBook,
    featured: true,
    status: 'Upcoming release',
  },
];

export const defaultBlogIntro =
  'Fresh reflections on psychoeducation, healing, parenting, learning, and holistic wellbeing will appear here when blog posts are published from the dashboard.';

export const heroStats = [
  { label: 'Psychoeducation sessions', value: 'School & community' },
  { label: 'Books and reflections', value: 'Growing collection' },
  { label: 'Order response', value: 'Managed in dashboard' },
];

export const mergeBooksById = (
  defaults: Array<{ id: string; [key: string]: any }>,
  remote: Array<{ id: string; [key: string]: any }>,
) => {
  const merged = defaults.map((book) => ({ ...book }));
  remote.forEach((book) => {
    const index = merged.findIndex((item) => item.id === book.id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...book };
      return;
    }
    merged.push(book);
  });
  return merged;
};

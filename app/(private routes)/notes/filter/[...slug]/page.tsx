import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
type Props = {
  params: Promise<{ slug: string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  return {
    title: `Notes ${tag}`,
    description: `Find your notes by ${tag} tag`,
    openGraph: {
      title: `Notes ${tag}`,
      description: `Find your notes by ${tag} tag`,
      url: ``,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub logo on a blue and green gradient background.',
        },
      ],
      type: 'article',
    },
  };
}

const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug[0];
  const normalizedTag = tag === 'all' ? '' : tag;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, normalizedTag],
    queryFn: () => fetchNotes('', 1, 12, normalizedTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient categoryId={normalizedTag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;

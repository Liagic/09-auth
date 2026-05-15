import { Metadata } from 'next';
import { getSingleNote } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { title, content } = await getSingleNote(id);
  return {
    title: `Note: ${title}`,
    description: content.slice(0, 30),
    openGraph: {
      title: `Note: ${title}`,
      description: content.slice(0, 100),
      url: `https://08-zustand-two-snowy.vercel.app/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title}`,
      description: content.slice(0, 3),
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

type Props = {
  params: Promise<{ id: string }>;
};

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => getSingleNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;

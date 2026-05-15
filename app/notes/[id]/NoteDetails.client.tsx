'use client';
import css from './NoteDetails.module.css';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '../../../components/Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getSingleNote } from '@/lib/api';
import { useRouter } from 'next/navigation';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getSingleNote(id),
    refetchOnMount: false,
  });
  const handleGoBack = () => {
    const isSure = confirm('Are you sure?');
    if (isSure) {
      router.back();
    }
  };
  if (isLoading) return <Loader />;

  if (error || !data) return <ErrorMessage />;

  const formattedDate = data.updatedAt
    ? `Updated at: ${data.updatedAt}`
    : `Created at: ${data.createdAt}`;

  return (
    <>
      {isSuccess && (
        <div className={css.container}>
          <button onClick={handleGoBack} className={css.backBtn}>
            Go back
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{data?.title}</h2>
            </div>
            <p className={css.tag}>{data?.tag}</p>
            <p className={css.content}>{data?.content}</p>
            <p className={css.date}>{formattedDate}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteDetailsClient;

'use client';
import css from './Notes.module.css';
import { fetchNotes } from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Link from 'next/link';
interface NotesClientProps {
  tag: string;
}
function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const updateSearchQuery = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 1000);
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['notes', searchQuery, currentPage, tag],
    queryFn: () => {
      return fetchNotes(searchQuery, currentPage, 12, tag);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={updateSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        )}
        <Link className={css.button} href={'/notes/action/create'}>
          Create note +
        </Link>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}

export default NotesClient;

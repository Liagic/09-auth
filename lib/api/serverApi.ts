import 'server-only';
import nextServer from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { cookies } from 'next/headers';

interface NoteHubResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  searchText: string = '',
  page: number = 1,
  perPage: number = 12,
  tag: string = ''
): Promise<NoteHubResponse> => {
  const cookieStore = await cookies();

  const params: {
    search?: string;
    page: number;
    perPage: number;
    tag?: string;
  } = {
    page,
    perPage,
  };

  if (searchText.trim()) {
    params.search = searchText;
  }

  if (tag.trim()) {
    params.tag = tag;
  }

  const response = await nextServer.get<NoteHubResponse>('/notes', {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const res = await nextServer.get<User>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

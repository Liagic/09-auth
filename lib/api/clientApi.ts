import nextServer from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface NoteHubResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNote {
  title: string;
  content: string;
  tag: string;
}

export type RLRequest = {
  email: string;
  password: string;
};

export const fetchNotes = async (
  searchText: string = '',
  page: number = 1,
  perPage: number = 12,
  tag: string = ''
): Promise<NoteHubResponse> => {
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

  const response = await nextServer.get<NoteHubResponse>('/notes', { params });
  return response.data;
};

export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await nextServer.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${noteId}`);
  return data;
};

export const getSingleNote = async (noteId: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${noteId}`);
  return data;
};

export const register = async (data: RLRequest): Promise<User> => {
  const response = await nextServer.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: RLRequest): Promise<User> => {
  const response = await nextServer.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await nextServer.get<User | null>('/auth/session');
    return Boolean(res.data);
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const response = await nextServer.patch<User>('/users/me', data);
  return response.data;
};

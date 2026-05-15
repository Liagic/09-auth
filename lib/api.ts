import axios, { all } from 'axios';
import type { Note } from '@/types/note';
interface NoteHubResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNote {
  title: string;
  content: string;
  tag: string;
}

const noteAPI = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});
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
  const response = await noteAPI.get<NoteHubResponse>('/notes', { params });
  return response.data;
};
export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await noteAPI.post<Note>('/notes', note);
  return data;
};
export const deleteNote = async (noteID: string) => {
  const { data } = await noteAPI.delete<Note>(`/notes/${noteID}`);
  return data;
};
export const getSingleNote = async (id: string) => {
  const response = await noteAPI.get<Note>(`/notes/${id}`);
  return response.data;
};

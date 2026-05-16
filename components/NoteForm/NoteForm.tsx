'use client';
import css from './NoteForm.module.css';
import { useId } from 'react';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';
interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  categoryId: Yup.string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Invalid tag value'
    )
    .required('Tag is required'),
});

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleCancel = () => router.push('/notes/filter/all');
  const initialValues: NoteFormValues = {
    title: draft?.title ?? '',
    content: draft?.content ?? '',
    tag: draft?.tag ?? 'Todo',
  };

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    mutation.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
      enableReinitialize
    >
      {({ values, handleChange }) => (
        <Form className={css.form}>
          <fieldset>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                type="text"
                name="title"
                className={css.input}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(event);
                  setDraft({
                    ...values,
                    title: event.target.value,
                  });
                }}
              />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
                as="textarea"
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  handleChange(event);
                  setDraft({
                    ...values,
                    content: event.target.value,
                  });
                }}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field
                id={`${fieldId}-tag`}
                name="categoryId"
                as="select"
                className={css.select}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(event);
                  setDraft({
                    ...values,
                    tag: event.target.value,
                  });
                }}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={css.submitButton}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Creating note...' : 'Create note'}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}

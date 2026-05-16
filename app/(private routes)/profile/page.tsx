import Link from 'next/link';
import css from './ProfilePage.module.css';
import Image from 'next/image';
import { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Personal data and settings',
  openGraph: {
    title: 'Profile',
    description: 'Personal data and settings',
    url: '#',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'ProfilePage Open Graph Image',
      },
    ],
  },
};

export default async function ProfilePage() {
  let user = null;
  try {
    user = await getMe();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }

  return (
    <>
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>

          <div className={css.avatarWrapper}>
            <Image
              src={
                user?.avatar ||
                'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'
              }
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user?.username}</p>
            <p>Email: {user?.email}</p>
          </div>
        </div>
      </main>
    </>
  );
}

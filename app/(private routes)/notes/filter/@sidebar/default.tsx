import Link from 'next/link';
import css from './SidebarNotes.module.css';
const NotesSidebar = async () => {
  const categories = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem} key={'Create note'}>
        <Link href={`/notes/action/create`} className={css.menuLink}>
          Create note
        </Link>
      </li>
      <li className={css.menuItem} key={'All'}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {categories.map(category => (
        <li className={css.menuItem} key={category}>
          <Link href={`/notes/filter/${category}`} className={css.menuLink}>
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NotesSidebar;

'use client';

import Image, { type StaticImageData } from 'next/image';
import cx from 'clsx';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import searchIcon from '@public/images/search.svg';

import classes from './Searchbar.module.css';

const Searchbar = ({ inHeader }: { inHeader: boolean }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams =
      params && params.get('q') ? `?q=${params.get('q')}&page=1` : '';
    if (pathname === '/search') {
      router.replace(`/search${queryParams}`);
    } else {
      router.push(`/search${queryParams}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
        cx(classes.form, {
          [classes['form_header']]: inHeader,
        })
      }
    >
      <input
        className={classes.input}
        name='search'
        placeholder='Search for posts ...'
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
        aria-label='Search the page'
      />
      <button
        className={classes.button}
        type='submit'
        aria-label='magnifying glass icon'
      >
        <Image
          className={classes.icon}
          src={searchIcon as StaticImageData}
          alt=''
          priority={true}
        />
      </button>
    </form>
  );
};

export default Searchbar;

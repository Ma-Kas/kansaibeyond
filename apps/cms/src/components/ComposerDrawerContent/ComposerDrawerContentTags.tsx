// Data fetching imports
import { useQuery } from '@tanstack/react-query';
import { getAllTags } from '../../requests/tagRequests';

import classes from './ComposerDrawerContent.module.css';

const ComposerDrawerContentTags = () => {
  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
    retry: 1,
  });

  return (
    <>
      <div className={classes['sidebar_drawer_tags_description']}>
        Create and assign tags to help readers find the blog posts they're
        looking for.
      </div>
    </>
  );
};

export default ComposerDrawerContentTags;

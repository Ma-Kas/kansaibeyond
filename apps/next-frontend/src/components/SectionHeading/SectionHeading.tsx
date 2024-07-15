import { ReactNode } from 'react';

import classes from './SectionHeading.module.css';

const SectionHeading = ({ children }: { children: ReactNode }) => {
  return <h2 className={classes['section_heading']}>{children}</h2>;
};

export const SectionHeadingDouble = ({ children }: { children: ReactNode }) => {
  return <h2 className={classes['section_heading_double']}>{children}</h2>;
};

export default SectionHeading;

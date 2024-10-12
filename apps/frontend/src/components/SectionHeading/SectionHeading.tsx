import { ReactNode } from 'react';

import classes from './SectionHeading.module.css';

export const SectionHeading = ({ children }: { children: ReactNode }) => {
  return <h2 className={classes['section_heading']}>{children}</h2>;
};

export const SectionHeadingDouble = ({ children }: { children: ReactNode }) => {
  return <h2 className={classes['section_heading_double']}>{children}</h2>;
};

export const MainSectionHeading = ({ children }: { children: ReactNode }) => {
  return <h1 className={classes['section_heading']}>{children}</h1>;
};

export const MainSectionHeadingDouble = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <h1 className={classes['section_heading_double']}>{children}</h1>;
};

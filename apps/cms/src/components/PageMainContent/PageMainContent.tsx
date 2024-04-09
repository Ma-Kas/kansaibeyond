import classes from './PageMainContent.module.css';

interface Props {
  mainContentHeaderRef: React.MutableRefObject<HTMLDivElement | null>;
  mainContentBodyRef: React.MutableRefObject<HTMLDivElement | null>;
  header: React.ReactNode;
  children: React.ReactNode;
}

const PageMainContent = ({
  mainContentHeaderRef,
  mainContentBodyRef,
  header,
  children,
}: Props) => {
  return (
    <div className={classes['page_main_content']}>
      <div
        ref={mainContentHeaderRef}
        className={classes['page_main_content_header']}
      >
        {header}
      </div>
      <div
        ref={mainContentBodyRef}
        className={classes['page_main_content_body']}
      >
        {children}
      </div>
    </div>
  );
};

export default PageMainContent;

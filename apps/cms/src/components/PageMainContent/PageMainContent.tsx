import classes from './PageMainContent.module.css';

interface Props {
  header: React.ReactNode;
  children: React.ReactNode;
}

const PageMainContent = ({ header, children }: Props) => {
  return (
    <div className={classes['page_main_content']}>
      <div className={classes['page_main_content_header']}>{header}</div>
      <div className={classes['page_main_content_body']}>{children}</div>
    </div>
  );
};

export default PageMainContent;

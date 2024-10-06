import { SectionHeading } from '../SectionHeading/SectionHeading';
import SocialReelImageSkeleton from '../Skeletons/SocialReelImageSkeleton';

import classes from './SocialMediaReel.module.css';

const SocialMediaReelSkeleton = () => {
  return (
    <section className={classes.section}>
      <SectionHeading>
        <span>Social</span>&nbsp;media
      </SectionHeading>
      <div className={classes['section_content']}>
        <div className={classes['images_container']}>
          {[...Array(5).keys()].map((value) => {
            return <SocialReelImageSkeleton key={value} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaReelSkeleton;

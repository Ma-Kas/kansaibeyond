import { InputWrapper, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LoadingNotification } from '../../components/FeedbackPopups/FeedbackPopups';
import { destroyWidgets } from '../../components/CloudinaryMediaLibraryWidget/cloudinary-helpers';
import CardEditCoverImage from '../../components/CardEditCoverImage/CardEditCoverImage';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from '../../config/constants';
import {
  ReturnDataAsset,
  InsertReturnData,
} from '../../components/CloudinaryMediaLibraryWidget/cloudinary-types';
import { useSocialMediaReelFormContext } from './social-media-reel-form-context';

import localClasses from './UpdateSocialMediaReel.module.css';

const SocialMediaReelInputGroup = ({ index }: { index: number }) => {
  const socialMediaReelForm = useSocialMediaReelFormContext();

  const createCloudinaryMediaLibraryWidget = () => {
    const loadingMediaLibraryPopup = notifications.show(
      LoadingNotification({ bodyText: 'Opening Media Library Widget' })
    );
    destroyWidgets();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.cloudinary.openMediaLibrary(
      {
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        remove_header: false,
        max_files: '1',
        multiple: false,
        insert_caption: 'Insert',
        default_transformations: [[]],
      },
      {
        insertHandler: (data: InsertReturnData) => {
          data.assets.forEach((asset: ReturnDataAsset) => {
            socialMediaReelForm.setFieldValue(
              `reelData.${index}.image.urlSlug`,
              `/${asset.public_id}.${asset.format}`
            );
          });
        },
        showHandler: () => {
          notifications.hide(loadingMediaLibraryPopup);
        },
      }
    );
  };

  return (
    <div className={localClasses['card_body_inner_input_group']}>
      <div className={localClasses['card_body_inner_left']}>
        <InputWrapper
          id='social-media-reel-image'
          label='Social Media Reel Image'
          description='Set the image to display in the reel'
          withAsterisk
        >
          <CardEditCoverImage
            id='social-media-reel-image'
            openMediaLibrary={createCloudinaryMediaLibraryWidget}
            coverImage={socialMediaReelForm.getValues().reelData[index].image}
          />
        </InputWrapper>
      </div>
      <div className={localClasses['card_body_inner_right']}>
        <TextInput
          label='Link URL'
          placeholder='e.g. https://www.instagram.com/p/..../'
          description='The social media post you want to link to'
          {...socialMediaReelForm.getInputProps(`reelData.${index}.url`)}
          required
        />
        <TextInput
          label='Image Alternative Text'
          placeholder='e.g. Mount Fuji and cherry blossoms'
          description='Help screen readers announce image'
          {...socialMediaReelForm.getInputProps(
            `reelData.${index}.image.altText`
          )}
          required
        />
      </div>
    </div>
  );
};

export default SocialMediaReelInputGroup;

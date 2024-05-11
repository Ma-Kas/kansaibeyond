/* eslint @typescript-eslint/no-unsafe-call: 0 */
/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
/* eslint @typescript-eslint/no-unsafe-argument: 0 */
import { memo } from 'react';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
} from '../../config/constants';
import { destroyWidgets } from './cloudinary-helpers';
import { InsertReturnData, ReturnDataAsset } from './cloudinary-types';

// Types
type WidgetProps = {
  handleInsert: (arg0: string) => void;
};

const CloudinaryWidget = memo(({ handleInsert }: WidgetProps) => {
  destroyWidgets();
  const cloudinaryWidget = window.cloudinary.createMediaLibrary(
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
      insertHandler: function (data: InsertReturnData) {
        data.assets.forEach((asset: ReturnDataAsset) => {
          handleInsert(`/${asset.public_id}.${asset.format}`);
        });
      },
    }
  );

  return (
    <>
      {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-return */}
      <button type='button' onClick={() => cloudinaryWidget.show()}>
        Open
      </button>
    </>
  );
});

export default CloudinaryWidget;

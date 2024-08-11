import { LexicalEditor } from 'lexical';
import {
  InsertReturnData,
  ReturnDataAsset,
} from '../components/CloudinaryMediaLibraryWidget/cloudinary-types';
import {
  INSERT_CAROUSEL_COMMAND,
  INSERT_GALLERY_COMMAND,
  INSERT_IMAGE_COMMAND,
} from '../pages/Editor/utils/exportedCommands';
import { InsertImagePayload } from '../pages/Editor/plugins/ImagesPlugin';
import { InsertGalleryImagePayload } from '../pages/Editor/plugins/ImageGalleryPlugin';
import { InsertCarouselImagePayload } from '../pages/Editor/plugins/ImageCarouselPlugin';
import {
  WSRV_BASE_URL,
  WSRV_TRANSFORM,
  CLOUDINARY_BASE_URL,
  EDITOR_SINGLE_IMAGE_TRANSFORM,
  EDITOR_GALLERY_IMAGE_TRANSFORM,
  EDITOR_CAROUSEL_IMAGE_TRANSFORM,
} from '../config/constants';

// Return custom image url for optimised delivery using transform string
const getTransformUrl = (asset: ReturnDataAsset, transform: string): string => {
  return `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${transform}/${asset.public_id}.${asset.format}${WSRV_TRANSFORM}`;
};

export const handleInsertSingleImage = (
  assetData: InsertReturnData,
  activeEditor: LexicalEditor
) => {
  const imageAsset = assetData.assets[0];

  const payload = {
    src: getTransformUrl(imageAsset, EDITOR_SINGLE_IMAGE_TRANSFORM),
    altText: 'Alternative text placeholder',
  };

  activeEditor.dispatchCommand(
    INSERT_IMAGE_COMMAND,
    payload as InsertImagePayload
  );
};

export const handleInsertGalleryImages = (
  assetData: InsertReturnData,
  activeEditor: LexicalEditor
) => {
  const payload: InsertGalleryImagePayload = [];
  assetData.assets.forEach((asset: ReturnDataAsset, index) => {
    payload.push({
      id: index,
      src: getTransformUrl(asset, EDITOR_GALLERY_IMAGE_TRANSFORM),
      altText: 'Alternative text placeholder',
    });
  });

  activeEditor.dispatchCommand(INSERT_GALLERY_COMMAND, payload);
};

export const handleInsertCarouselImages = (
  assetData: InsertReturnData,
  activeEditor: LexicalEditor
) => {
  const payload: InsertCarouselImagePayload = [];
  assetData.assets.forEach((asset: ReturnDataAsset, index) => {
    payload.push({
      id: index,
      src: getTransformUrl(asset, EDITOR_CAROUSEL_IMAGE_TRANSFORM),
      altText: 'Alternative text placeholder',
    });
  });

  activeEditor.dispatchCommand(INSERT_CAROUSEL_COMMAND, payload);
};

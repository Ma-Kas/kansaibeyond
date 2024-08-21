import axios from 'axios';
import { BACKEND_BASE_URL } from '../config/constants';
import { socialMediaReelSchema } from '../types/request-schemas';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

export const getSocialMediaReel = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/social-media-reels`);
    return socialMediaReelSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updateSocialMediaReel = async (id: number, reelData: unknown) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/social-media-reels/${id}`,
      reelData
    );
    return socialMediaReelSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

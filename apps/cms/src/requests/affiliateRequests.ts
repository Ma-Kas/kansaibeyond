import axios from 'axios';
import { BACKEND_BASE_URL } from '../config/constants';
import {
  affiliateSchema,
  allAffiliatesSchema,
  newUpdateAffiliateSchema,
  deleteOneSchema as deleteAffiliateSchema,
} from '../types/request-schemas';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

export const getAllAffiliates = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/affiliates`);
    return allAffiliatesSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const getOneAffiliate = async (id: number) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/affiliates/${id}`);
    return affiliateSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const postAffiliate = async (affiliateData: unknown) => {
  try {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/affiliates`,
      affiliateData
    );
    return newUpdateAffiliateSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updateAffiliate = async (id: number, affiliateData: unknown) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/affiliates/${id}`,
      affiliateData
    );
    return newUpdateAffiliateSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const deleteAffiliate = async (id: number) => {
  try {
    const response = await axios.delete(`${BACKEND_BASE_URL}/affiliates/${id}`);
    return deleteAffiliateSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

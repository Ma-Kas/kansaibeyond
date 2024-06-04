import axios from 'axios';
import { z } from 'zod';
import { BACKEND_BASE_URL } from '../config/constants';
import { userRoleSchema } from './userRequests';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

// Zod Schemas
// prettier-ignore
const affiliateUserSchema = z.object(
  {
    username: z.string(),
    displayName: z.string(),
    userIcon:z.string().nullable(),
    role: userRoleSchema,
  }
).strict();

// prettier-ignore
const affiliateSchema = z.object(
  {
    id: z.number(),
    blogName: z.string(),
    blogUrl: z.string().url(),
    blogDescription: z.string(),
    userId: z.number().nullable().optional(),
    user: affiliateUserSchema.optional().nullable(),
  }
).strict();

export type Affiliate = z.infer<typeof affiliateSchema>;

const allAffiliatesSchema = z.array(affiliateSchema);

const newUpdateAffiliateSchema = affiliateSchema;

// prettier-ignore
const deleteAffiliateSchema = z.object(
  {
    message: z.string(),
  }
).strict();

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

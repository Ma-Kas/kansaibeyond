import axios from 'axios';
import { BACKEND_BASE_URL } from '../config/constants';
import {
  userSchema,
  allUsersSchema,
  newUpdateUserSchema,
  deleteOneSchema as deleteUserSchema,
} from '../types/request-schemas';
import { handleRequestErrors } from '../utils/backend-error-response-validation';

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/users`);
    return allUsersSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const getOneUser = async (username: string) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/users/${username}`);
    return userSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const postUser = async (userData: unknown) => {
  try {
    const response = await axios.post(`${BACKEND_BASE_URL}/users`, userData);
    return newUpdateUserSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const updateUser = async (username: string, userData: unknown) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/users/${username}`,
      userData
    );
    return newUpdateUserSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

export const deleteUser = async (username: string) => {
  try {
    const response = await axios.delete(
      `${BACKEND_BASE_URL}/users/${username}`
    );
    return deleteUserSchema.parse(response.data);
  } catch (err) {
    handleRequestErrors(err);
    return null;
  }
};

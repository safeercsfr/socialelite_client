import config from "./config";
import axios from "axios";

// GET REQUEST
export const getDataAPI = async (url, token) => {
  const res = await axios.get(config.SERVER_URL + url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// POST REQUEST
export const postDataAPI = async (url, formData, token) => {
  const res = await axios.post(config.SERVER_URL + url, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// PUT REQUEST
export const putDataAPI = async (url, formData, token) => {
  const res = await axios.put(config.SERVER_URL + url, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// PATCH REQUEST
export const patchDataAPI = async (url, userId, token) => {
  const res = await axios.patch(
    config.SERVER_URL + url,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
      "Content-Type": "application/json",
    }
  );
  return res;
};

// DELETE REQUEST
export const deleteDataAPI = async (url, token) => {
  const res = await axios.delete(config.SERVER_URL + url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

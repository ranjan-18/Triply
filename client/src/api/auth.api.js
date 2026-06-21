import axiosInstance from "./axiosInstance";

export const registerUser = async (
  payload
) => {
  const { data } =
    await axiosInstance.post(
      "/auth/register",
      payload
    );

  return data;
};

export const loginUser = async (
  payload
) => {
  const { data } =
    await axiosInstance.post(
      "/auth/login",
      payload
    );

  return data;
};
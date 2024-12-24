import axios from "axios";

export const authAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("dancify-auth-token")}`,
  },
});

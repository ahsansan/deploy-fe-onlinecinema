import axios from "axios";

export const API = axios.create({
  baseURL: "https://deploy-be-onlinecinema.vercel.app/api/cinema/v1/",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// import axios from "axios";
// import dotenv from 'dotenv';

// dotenv.config();

// const MY_TOKEN = process.env.MY_TOKEN;
// const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;

// export const getAxiosInstance = () => {
//   return {
//     get(method, params) {
//       return axios.get(`/${method}`, {
//         baseURL: BASE_URL,
//         params,
//       });
//     },
//     post(method, data) {
//       return axios({
//         method: "post",
//         baseURL: BASE_URL,
//         url: `/${method}`,
//         data,
//       });
//     },
//   };
// };
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `https://api.telegram.org/bot${process.env.MY_TOKEN}`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const sendRequest = (method, data) => {
  return axiosInstance[method](method === "get" ? `/${data.method}` : `/${data.method}`, data.params || data);
};

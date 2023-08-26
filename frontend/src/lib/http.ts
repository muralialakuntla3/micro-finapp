import axios from "axios";


const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "x-api-key": localStorage.getItem("api-key"),
  },
});

export default http;

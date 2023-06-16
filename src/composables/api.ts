import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const SERVE_URL = import.meta.env.VITE_SERVE_URL as string;

export const axiosInstanceApi = axios.create({
    baseURL: API_URL,
});

export const axiosInstanceServe = axios.create({
    baseURL: SERVE_URL,
});

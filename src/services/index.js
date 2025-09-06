// src/services/index.js
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const AXIOS = axios.create({
  // baseURL: "http://localhost:4000"
  baseURL: "https://endcardapio.onrender.com/"
});

// Adicionando o interceptor de requisição para incluir o token
AXIOS.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const queryClient = new QueryClient();
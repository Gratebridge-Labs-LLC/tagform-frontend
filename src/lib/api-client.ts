import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear tokens
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  register: async (data: { email: string; password: string; fullName: string }) => {
    const response = await apiClient.post("/auth/register", data);
    // Store tokens in cookies
    Cookies.set("access_token", response.data.session.access_token);
    Cookies.set("refresh_token", response.data.session.refresh_token);
    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    // Store tokens in cookies
    Cookies.set("access_token", response.data.session.access_token);
    Cookies.set("refresh_token", response.data.session.refresh_token);
    return response;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    // Clear tokens from cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    return response;
  },

  getProfile: async () => {
    return apiClient.get("/auth/profile");
  },

  initiateGoogleSignIn: () => {
    // Use window.location only for external redirects
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  },
};

export default apiClient; 
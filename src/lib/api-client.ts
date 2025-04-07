import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
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
      // Clear tokens and redirect to login
      localStorage.removeItem("access_token");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  register: async (data: { email: string; password: string; fullName: string }) => {
    return apiClient.post("/auth/register", data);
  },

  login: async (data: { email: string; password: string }) => {
    return apiClient.post("/auth/login", data);
  },

  logout: async () => {
    return apiClient.post("/auth/logout");
  },

  getProfile: async () => {
    return apiClient.get("/auth/profile");
  },

  initiateGoogleSignIn: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  },
};

export default apiClient; 
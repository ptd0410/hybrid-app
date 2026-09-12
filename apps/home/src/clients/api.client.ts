import axios from "axios";

export const apiClient = axios.create({
  //   baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response?.data ?? response;
  },

  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          // Handle forbidden
          break;

        case 500:
          // Handle server error
          break;
      }
    }

    return Promise.reject(error);
  },
);

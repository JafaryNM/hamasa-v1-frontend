import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://13.48.124.122/hamasa-api/v1/",
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

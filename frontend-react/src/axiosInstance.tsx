import axios from "axios";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: VITE_BASE_URL,
  // timeout: 10000,
  // headers: {
  //     'Content-Type': 'application/json',
  // },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("request==>", config);

    return config;
  },
  (error) => {
    console.log("response error==>", error);
    return Promise.reject(error);
  },
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response==>", response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Safely check if error.response exists and is 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");
      
      if (refreshToken) {
        try {
          // Use basic axios (not axiosInstance) to prevent request/response interceptor loops
          const response = await axios.post(`${VITE_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("access", newAccessToken);

          // Update the authorization header for the original request
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh fails (e.g. refresh token is expired), log out the user
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    console.log("response error==>", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;

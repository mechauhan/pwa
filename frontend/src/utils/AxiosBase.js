import axios from "axios";

const apiUrl = "http://localhost:4000/user/";

// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(

//   "accessToken"

// )}`;

const AxiosBase = axios.create({
  baseURL: apiUrl,
});

// Add a request interceptor

AxiosBase.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    // Do something with request error

    return Promise.reject(error);
  }
);

AxiosBase.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();

      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default AxiosBase;

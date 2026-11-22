import axios from "axios";
import { to } from "./paths";

const ApiBase = import.meta.env.PUBLIC_API_BASE_URL;

// ========================
// 🔹 Token Helpers
// ========================
export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}
export function saveRes(res){
  localStorage.setItem("res",res);
}

// ========================
// 🔹 Axios Instance
// ========================
const api = axios.create({
  baseURL: ApiBase,
  headers: { "Content-Type": "application/json" },
});

// ========================
// 🔹 Request Interceptor
// ========================
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && token !== "null" && token !== "undefined") {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ========================
// 🔹 Response Interceptor
// ========================
api.interceptors.response.use(
  (res) => {
    // Save token when logging in
    if (res.config.url?.includes("/users/login") && typeof res.data === "string") {
      if (res.data.trim().length > 0) {
        console.log(res);
        saveRes(res.data);
        
        saveToken(res.data); 
      } else {
        return Promise.reject(new Error("Invalid Credentials"));
      }
    }
    return res.data;
  },
  (err) => {
    if (err?.response) {
      const { status, data } = err.response;

      if (status === 401) {
        // Unauthorized → Token expired / invalid
        clearToken();
        alert("Session Expired or Invalid. Please log in again.");
        window.location.href = to('/login');
      } else if (status === 403) {
        // Forbidden → Wrong role
        alert(" You don’t have permission to access this resource.");
      } else if (status === 404) {
        // Not Found → No data
        alert(" Requested data not found.");
      } else {
        alert(`Unexpected error: ${data || "Something went wrong"}`);
      }
    } else {
      alert("Network error. Please check your connection.");
    }

    return Promise.reject(err);
  }
);

export default api;

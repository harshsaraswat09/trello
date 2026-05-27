import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authApiInstance = axios.create({
  baseURL: `${BASE}/v1/auth/`,
});

export const registerUser = async ({ name, email, password, role, department, managerId }) => {
  const response = await authApiInstance.post("/register", {
    name,
    email,
    password,
    role,
    department,
    managerId,
  });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await authApiInstance.post("/login", { email, password });
  return response.data;
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
  const response = await authApiInstance.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
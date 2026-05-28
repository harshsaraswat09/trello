import { useDispatch } from "react-redux";
import { setUser, setToken, setLoading, setError, logout as logoutAction } from "../store/auth.slice.js";
import { registerUser, loginUser, getUser } from "../services/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ name, email, password, role, department, managerId }) {
    try {
      dispatch(setLoading(true));
      const response = await registerUser({ name, email, password, role, department, managerId });
      const payload = response.data || response;
      const user = payload.user || payload;
      const token = payload.accessToken || payload.token;
      if (!token) throw new Error("Authentication token missing in register response");
      dispatch(setUser(user));
      dispatch(setToken(token));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Registration failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const response = await loginUser({ email, password });
      const payload = response.data || response;
      const user = payload.user || payload;
      const token = payload.accessToken || payload.token;
      if (!token) throw new Error("Authentication token missing in login response");
      dispatch(setUser(user));
      dispatch(setToken(token));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const response = await getUser();
      const payload = response.data || response;
      const user = payload.data || payload;
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setError(err.response?.data?.message || "Session expired. Please login again."));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleLogout() {
    dispatch(logoutAction());
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};

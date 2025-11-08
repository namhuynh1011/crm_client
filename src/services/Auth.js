import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const LOGIN_PATH = "/auth/login";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const CURRENT_USER_KEY = "currentUser";

function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // atob may produce binary string; decodeURIComponent handles non-ASCII
    const jsonPayload = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("parseJwt error:", e);
    return null;
  }
}

/**
 * Lấy token từ localStorage
 */
function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Lấy user (payload JWT) từ token đã lưu (hoặc null)
 */
function getCurrentUser() {
  const token = getAccessToken();
  const payload = parseJwt(token);
  if (!payload) return null;
  // payload chứa id, email, role, iat, exp theo token bạn cung cấp
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    iat: payload.iat,
    exp: payload.exp,
    rawPayload: payload,
  };
}

/**
 * Kiểm tra token đã hết hạn chưa
 * exp trong JWT là seconds since epoch
 */
function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= payload.exp;
}

/**
 * Authorization header helper
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function login(credentials) {
  try {
    const res = await axios.post(`${API_URL}${LOGIN_PATH}`, credentials);
    const data = res.data;

    if (data?.err === 0 && data?.token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
      // parse và lưu user nếu muốn...
      return { raw: data };
    } else {
      // API trả lỗi với body (4xx nhưng axios may still resolve? usually reject)
      const message = data?.msg || "Login failed";
      throw { message, raw: data };
    }
  } catch (error) {
    // Thông tin chi tiết để debug
    const networkError = !error.response;
    if (networkError) {
      // Không có response từ server (CORS, network, server down)
      console.error("Network/CORS or server unreachable:", error);
      throw { message: "Network or server error: không nhận được phản hồi từ server.", detail: error.message };
    } else {
      // Server trả lỗi với status & data
      console.error("Login error response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      const errData = error.response.data || {};
      const message = errData.msg || errData.message || `Server returned ${error.response.status}`;
      throw { message, raw: errData, status: error.response.status };
    }
  }
}


function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  // Nếu backend cần revoke token, gọi API revoke tại đây
}



function authHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function updateTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}
function getTokenExpiryDate(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return null;
  return new Date(payload.exp * 1000);
}

export {
  axiosInstance,
  login,
  logout,
  getAccessToken,
  getCurrentUser,
  isTokenExpired,
  authHeader,
  getTokenExpiryDate,
  parseJwt,
};

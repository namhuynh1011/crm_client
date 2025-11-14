import axios from "axios";

const AUTH_API_URL = `${process.env.REACT_APP_API_URL}/auth`;
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
 * Authorization header helper (not used by axiosInstance interceptor but kept for convenience)
 */
function authHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* axios instance pointed at /auth base */
const axiosInstance = axios.create({
  baseURL: AUTH_API_URL,
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
    const res = await axios.post(`${AUTH_API_URL}/login`, credentials);
    const data = res.data;

    if (data?.err === 0 && data?.token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
      // optionally store currentUser if returned
      if (data.user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      } else {
        // try parse token for basic info
        const payload = parseJwt(data.token);
        if (payload) {
          const u = {
            id: payload.id,
            fullName: payload.fullName || payload.name || "",
            email: payload.email,
            role: payload.role,
            avatar: payload.avatar || "",
          };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
        }
      }
      return { raw: data };
    } else {
      const message = data?.msg || "Login failed";
      throw { message, raw: data };
    }
  } catch (error) {
    const networkError = !error.response;
    if (networkError) {
      console.error("Network/CORS or server unreachable:", error);
      throw { message: "Network or server error: không nhận được phản hồi từ server.", detail: error.message };
    } else {
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

/**
 * Update profile API (uses axiosInstance baseURL => /auth)
 * Backend route: PUT /auth/update/profile/
 */
async function updateProfile(payload) {
  try {
    const res = await axiosInstance.put("/update/profile/", payload);
    return res.data;
  } catch (err) {
    if (err?.response?.data) throw err.response.data;
    throw err;
  }
}

/**
 * Change password API
 * Backend route: PUT /auth/change-password/
 */
async function changePassword(payload) {
  try {
    const res = await axiosInstance.put("/change-password/", payload);
    return res.data;
  } catch (err) {
    if (err?.response?.data) throw err.response.data;
    throw err;
  }
}

async function getCurrentUser() {
  const token = getAccessToken();

  // If no token, try to return cached currentUser from localStorage (if present)
  if (!token) {
    try {
      const cached = localStorage.getItem(CURRENT_USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  try {
    // call backend endpoint that returns user data: GET /auth/me
    const res = await axiosInstance.get("/me");
    const data = res.data;

    // expect backend to return { err:0, msg:'OK', data: userObj }
    if (data && (data.err === 0 || data.err === undefined)) {
      const userData = data.data || data.user || data; // tolerate shapes
      if (userData) {
        try {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        } catch (e) {
          // ignore localStorage write errors
        }
        return userData;
      }
    }

    // fallback: try parse token payload or localStorage
    try {
      const cached = localStorage.getItem(CURRENT_USER_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    const payload = parseJwt(token);
    if (payload) {
      return {
        id: payload.id,
        fullName: payload.fullName || payload.name || "",
        email: payload.email,
        role: payload.role,
        avatar: payload.avatar || "",
        rawPayload: payload,
      };
    }
    return null;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    // if unauthorized, remove tokens and cached user
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      try {
        logout();
      } catch {}
      return null;
    }

    // otherwise, try to return cached user or token-payload fallback
    try {
      const cached = localStorage.getItem(CURRENT_USER_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    const payload = parseJwt(token);
    if (payload) {
      return {
        id: payload.id,
        fullName: payload.fullName || payload.name || "",
        email: payload.email,
        role: payload.role,
        avatar: payload.avatar || "",
        rawPayload: payload,
      };
    }
    return null;
  }
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
  updateProfile,
  changePassword,
};
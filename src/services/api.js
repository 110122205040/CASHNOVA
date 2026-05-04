import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL?.trim() || "";

const client = axios.create({
  baseURL: baseURL || undefined,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

const authTokenKeys = ["cashnova_auth_token", "cashnovaToken", "token"];
const loginPaths = ["/auth/login", "/api/auth/login", "/login", "/api/login"];
const signupPaths = [
  "/auth/register",
  "/api/auth/register",
  "/auth/signup",
  "/api/auth/signup",
  "/register",
  "/api/register",
  "/signup",
  "/api/signup",
];
const otpPaths = [
  "/auth/send-otp",
  "/api/auth/send-otp",
  "/auth/signup/send-otp",
  "/api/auth/signup/send-otp",
  "/send-otp",
  "/api/send-otp",
];
const forgotPasswordPaths = [
  "/auth/forgot-password",
  "/api/auth/forgot-password",
  "/forgot-password",
  "/api/forgot-password",
  "/password/forgot",
  "/api/password/forgot",
];
const entryPaths = ["/entries", "/api/entries"];
const dashboardPaths = ["/dashboard", "/api/dashboard"];
const preferencePaths = ["/settings", "/api/settings", "/preferences", "/api/preferences"];
const profilePaths = ["/profile", "/api/profile", "/user/profile", "/api/user/profile"];
const passwordPaths = [
  "/auth/change-password",
  "/api/auth/change-password",
  "/change-password",
  "/api/change-password",
  "/user/change-password",
  "/api/user/change-password",
];
const entryDetailPaths = (entryId) => [`/entries/${entryId}`, `/api/entries/${entryId}`];

const getStoredAuthToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  for (const storage of [window.sessionStorage, window.localStorage]) {
    for (const key of authTokenKeys) {
      const token = storage.getItem(key);

      if (token) {
        return token;
      }
    }
  }

  return "";
};

client.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrapList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const collectionKeys = ["entries", "items", "records", "data"];

  for (const key of collectionKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  if (payload.data && typeof payload.data === "object") {
    for (const key of collectionKeys) {
      if (Array.isArray(payload.data[key])) {
        return payload.data[key];
      }
    }
  }

  return [];
};

const unwrapItem = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  if (payload.entry && typeof payload.entry === "object") {
    return payload.entry;
  }

  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

const unwrapAuthPayload = (payload) => {
  const item = unwrapItem(payload);

  if (!item || typeof item !== "object") {
    return { user: null, token: "" };
  }

  const user =
    item.user ??
    item.account ??
    item.profile ??
    item.client ??
    item.customer ??
    item;
  const token =
    item.token ??
    item.accessToken ??
    item.access_token ??
    item.authToken ??
    item.jwt ??
    "";

  return { user, token };
};

const requestFirstAvailable = async (method, paths, payload) => {
  let lastError;

  for (const path of paths) {
    try {
      return await client.request({
        method,
        url: path,
        data: payload,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Backend request failed.");
};

const api = {
  hasBackend: () => Boolean(baseURL),

  login: async ({ email, password }) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("post", loginPaths, {
      email,
      identifier: email,
      phone: email,
      password,
    });
    return unwrapAuthPayload(response.data);
  },

  signup: async ({ fullName, contactNumber, email, password, otp }) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("post", signupPaths, {
      fullName,
      name: fullName,
      contactNumber,
      phone: contactNumber,
      email,
      password,
      otp,
    });
    return unwrapAuthPayload(response.data);
  },

  requestSignupOtp: async ({ fullName, contactNumber, email }) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("post", otpPaths, {
      fullName,
      name: fullName,
      contactNumber,
      phone: contactNumber,
      email,
    });
    return unwrapItem(response.data);
  },

  forgotPassword: async ({ email }) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("post", forgotPasswordPaths, {
      email,
      identifier: email,
      phone: email,
    });
    return unwrapItem(response.data);
  },

  getSocialAuthUrl: (provider) => {
    if (!baseURL) {
      return "";
    }

    const normalizedProvider = String(provider ?? "").toLowerCase();
    return `${baseURL.replace(/\/$/, "")}/auth/${normalizedProvider}`;
  },

  getEntries: async () => {
    if (!baseURL) {
      return [];
    }

    const response = await requestFirstAvailable("get", entryPaths);
    return unwrapList(response.data);
  },

  createEntry: async (entry) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("post", entryPaths, entry);
    return unwrapItem(response.data);
  },

  updateEntry: async (entryId, entry) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("put", entryDetailPaths(entryId), entry);
    return unwrapItem(response.data);
  },

  deleteEntry: async (entryId) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("delete", entryDetailPaths(entryId));
    return unwrapItem(response.data);
  },

  getDashboardData: async () => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("get", dashboardPaths);
    return unwrapItem(response.data);
  },

  getPreferences: async () => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("get", preferencePaths);
    return unwrapItem(response.data);
  },

  updatePreferences: async (preferences) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("put", preferencePaths, preferences);
    return unwrapItem(response.data);
  },

  updateProfile: async (profile) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("put", profilePaths, profile);
    return unwrapItem(response.data);
  },

  changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
    if (!baseURL) {
      return null;
    }

    const response = await requestFirstAvailable("post", passwordPaths, {
      oldPassword,
      currentPassword: oldPassword,
      newPassword,
      confirmPassword,
    });
    return unwrapItem(response.data);
  },
};

export default api;

import { api, getAuthToken } from "./client";
import { LOCAL_DEMO_TOKEN, LOCAL_DEMO_USER } from "./demoFallback";

const toLocalAuthResponse = () => ({ token: LOCAL_DEMO_TOKEN, user: LOCAL_DEMO_USER });

export const authApi = {
  register: async (data) => {
    try {
      return await api.post("/auth/register", data);
    } catch (error) {
      if (((data && data.nickname) || "").trim().toLowerCase() === "tcm") {
        console.warn("[authApi] fallback to local demo user:", error.message);
        return toLocalAuthResponse();
      }
      throw error;
    }
  },
  login: async (data) => {
    try {
      return await api.post("/auth/login", data);
    } catch (error) {
      if (((data && data.userId) || "").trim().toLowerCase() === "tcm") {
        console.warn("[authApi] fallback login for local demo user:", error.message);
        return toLocalAuthResponse();
      }
      throw error;
    }
  },
  getMe: async () => {
    const token = getAuthToken();
    if (token === LOCAL_DEMO_TOKEN) {
      return LOCAL_DEMO_USER;
    }
    return api.get("/auth/me");
  },
};

export const studentVerificationApi = {
  startEmailVerification: (data) => api.post("/student-verifications/email/start", data),
  confirmEmailVerification: (data) => api.post("/student-verifications/email/confirm", data),
  submitManualVerification: (data) => api.post("/student-verifications/manual", data),
  getCurrentVerification: () => api.get("/student-verifications/current"),
};

import { useMutation } from "@tanstack/react-query";
import authService from "@/services/authService";
import { SignIn } from "@/@type/SignIn";

export const useSign = () => {
  return useMutation({
    mutationFn: async (payload: SignIn) => {
      console.log("payload sent to API:", payload);

      // 👈 Correct POST endpoint → /auth/login/
      const res = await authService.create(payload, "/login");

      console.log("API response:", res.data);
      return res.data;
    },

    onSuccess: (data) => {
      if (data?.access_token) {
        localStorage.setItem("access", data.access_token);
      }

      if (data?.refresh_token) {
        localStorage.setItem("refresh", data.refresh_token);
      }
    },

    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });
};

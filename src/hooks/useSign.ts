import { useMutation } from "@tanstack/react-query";
import authService from "@/services/authService";
import { SignIn } from "@/@type/SignIn";

export const useSign = () => {
  return useMutation({
    mutationFn: (payload: SignIn) =>
      authService.post("/login", payload).then((res) => res.data),

    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
    },

    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });
};

import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSign } from "@/hooks/useSign";
import toast from "react-hot-toast";
import { SignInSchema, SignInSchemaType } from "@/Schema/SignSchema";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function SignInForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useSign();

  const onSubmit = (data: SignInSchemaType) => {
    signIn(data, {
      onSuccess: (response) => {
        console.log(response);
        if (response?.access_token && response?.refresh_token) {
          console.log(response.access_token, response.refresh_token);
          localStorage.setItem("access", response.access_token);
          localStorage.setItem("refresh", response.refresh_token);
          toast.success("Login Successful");
          setTimeout(() => navigate("/dashboard"), 800);
        }
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          "Login failed, please check your credentials";

        toast.error(message);
      },
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6 text-center">
            <h1 className="!mb-1 text-3xl font-bold p-4">Sign In</h1>
            <p className="text-gray-500">Enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="block mb-1 font-medium">Email / Username</label>

              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email or username"
                    className={errors.identifier ? "border-red-500" : ""}
                  />
                )}
              />

              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                )}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSign } from "@/hooks/useSign";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignInSchemaType } from "@/Schema/SignSchema";

export default function SignInForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useSign();

  const onSubmit = (data: SignInSchemaType) => {
    console.log("Submitted Data:", data);

    signIn(data, {
      onSuccess: (response) => {
        console.log("Response received:", response);

        if (response?.access_token) {
          localStorage.setItem("access", response.access_token);
        }

        if (response?.refresh_token) {
          localStorage.setItem("refresh", response.refresh_token);
        }

        toast.success("Login Successful");

        setTimeout(() => navigate("/dashboard"), 700);
      },

      onError: (err: any) => {
        console.log("LOGIN ERROR:", err?.response);

        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Invalid credentials";

        toast.error(message);
      },
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold p-4">Sign In</h1>
            <p className="text-gray-500">Enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="block mb-1 font-medium">Email / Username</label>

              <Controller
                name="identifier"
                control={control}
                rules={{ required: "Identifier is required" }}
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
                rules={{ required: "Password is required" }}
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

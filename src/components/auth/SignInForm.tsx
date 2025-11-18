import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Typography } from "antd";
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

const { Title, Text } = Typography;

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
    console.log("FORM DATA:", data);
    console.log(data);

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
            <Title level={3} className="!mb-1">
              Sign In
            </Title>
            <Text className="text-gray-500">Enter your credentials</Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Identifier */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email / Username</label>

              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter email or username"
                    size="large"
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
            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Enter your password"
                    size="large"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                )}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

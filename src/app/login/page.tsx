"use client";

import logMeIn from "@/actions/logMeIn";
import Button from "@/components/elements/Button";
import InputEmail from "@/components/elements/InputEmail";
import InputPassword from "@/components/elements/InputPassword";
import IconLoader from "@/components/IconLoader";
import { regexChecks, routes } from "@/config";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Index = () => {
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    clearErrors,
  } = useForm();

  // Router
  const router = useRouter();

  // On form submit function
  const onSubmit = async (data: any) => {
    try {
      // Extract email and password from the fields
      const email = String(data.email) || "";
      const password = String(data.password) || "";

      // Login admin
      const loginStatus = await logMeIn({
        email,
        password,
      });

      // If failed login
      if (!loginStatus.status) {
        throw new Error(loginStatus.message);
      }

      // Show success toast
      toast.success(loginStatus.message ?? "Login successfully.");

      // Redirect admin to home
      router.replace(routes.home.url);
      //
    } catch (error: any) {
      // Display error message
      toast.error(
        error.message ?? "Something went wrong. Please try again later."
      );

      // If error for email/pass inputs
      if (error.message?.toLowerCase()?.includes("wrong")) {
        // Set errors for email and password fields
        setError("email", {
          type: "serverError",
          message: "Please check your email.",
        });
        setError("password", {
          type: "serverError",
          message: "Please check your password.",
        });
      }
    }
  };

  // Return JSX
  return (
    <div className="login bg-white h-dvh w-full flex flex-col items-center justify-center p-body">
      <div className="wrapper p-body border border-primary rounded-[2rem] mx-auto max-sm:w-full min-w-fit">
        {/* Logo */}
        <h1 className="text-[3rem] text-title uppercase mb-[3rem] font-bold">
          Please Login
        </h1>

        {/* Form */}
        <div className="form w-full sm:w-[50rem]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            className="login-form flex flex-col w-full"
          >
            {/* Input Fields  */}
            <div className="fields flex flex-col gap-[3.5rem]">
              {/* Email */}
              <div className="email space-y-[1rem]">
                <InputEmail
                  required
                  errorMessage={`${errors.email?.message || ""}`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: regexChecks.email,
                      message: "Enter valid email id",
                    },
                    minLength: {
                      value: 10,
                      message: "Email must be at least 10 characters long",
                    },
                  })}
                  onChange={(e) => {
                    setValue("email", e.target.value);
                    if (errors.email) clearErrors("email");
                  }}
                />
              </div>

              {/* Password */}
              <div className="password space-y-[1rem]">
                <InputPassword
                  required
                  errorMessage={`${errors.password?.message || ""}`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long.",
                    },
                  })}
                  onChange={(e) => {
                    setValue("password", e.target.value);
                    if (errors.password) clearErrors("password");
                  }}
                />
              </div>
            </div>

            {/* Submit button  */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-[4rem]"
            >
              {isSubmitting ? <IconLoader /> : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;

"use client";

import logMeIn from "@/actions/logMeIn";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { regexChecks, routes } from "@/config";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Index = () => {
  // React Hook Form
  const form = useForm<{ email: string; password: string }>();

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
      router.replace(routes.dashboard.url);
      //
    } catch (error: any) {
      // Display error message
      toast.error(
        error.message ?? "Something went wrong. Please try again later."
      );

      // If error for email/pass inputs
      if (error.message?.toLowerCase()?.includes("wrong")) {
        // Set errors for email and password fields
        form.setError("email", {
          type: "serverError",
          message: "Please check your email.",
        });
        form.setError("password", {
          type: "serverError",
          message: "Please check your password.",
        });
      }
    }
  };

  // Return JSX
  return (
    <div className="login bg-white h-dvh w-full flex flex-col items-center justify-center p-body">
      <div className="wrapper p-body border border-primary rounded-[1rem] w-full md:max-w-[30rem]">
        {/* Logo */}
        <h1 className="text-[3rem] text-title uppercase mb-[3rem] font-bold">
          Please Login
        </h1>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="!w-full flex flex-col gap-body"
          >
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: regexChecks.email,
                  message: "Enter valid email id",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input required placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input required placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Index;

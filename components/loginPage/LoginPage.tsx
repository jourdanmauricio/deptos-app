"use client";

import { z } from "zod";
import { FieldErrors, useForm } from "react-hook-form";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/custom/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButon } from "@/components/ui/custom/submit-buton";
import { loginFormSchema } from "@/shared/schemas";
import { Eye, EyeClosed, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "deptosapp@gmail.com",
      password: "deptosapp",
    },
  });
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values);
  };
  const handleSubmitError = (
    errors: FieldErrors<z.infer<typeof loginFormSchema>>
  ) => {
    console.log(errors);
  };
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="font-semibold text-3xl">Deptos App 🔐</span>
            <span className="font-semibold text-2xl">Login</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleSubmitError)}>
            <div className="flex flex-col gap-10 w-full">
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                form={form}
                icon={<Mail className="h-4 w-4 text-neutral-500" />}
              />

              <InputField
                label="Password"
                name="password"
                placeholder="Password"
                form={form}
                type={showPassword ? "text" : "password"}
                icon={
                  showPassword ? (
                    <Eye className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-neutral-500" />
                  )
                }
                iconOnClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </div>

            <div className="flex justify-end mt-10">
              <SubmitButon
                className="min-w-[150px]"
                text="Login"
                isLoading={form.formState.isSubmitting}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { LoginPage };

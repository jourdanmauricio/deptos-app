"use client";

import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FieldErrors, useForm } from "react-hook-form";

import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { loginFormSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/ui/custom/input-field";
import { SubmitButon } from "@/components/ui/custom/submit-buton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "detosapp@gmail.com",
      password: "detosapp",
    },
  });
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!res?.ok) {
      toast.error("Credenciales incorrectas");
    }

    toast.success("Bienvenido!!!");
    router.push("/dashboard");
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
                autoFocus
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

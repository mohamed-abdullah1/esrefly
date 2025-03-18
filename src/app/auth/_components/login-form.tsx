"use client";
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../actions";
import { toast } from "sonner";
import { COOKIES_KEYS } from "@/lib/enums";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const formSchema = z.object({
  id: z.string().min(1).min(2).max(50),
  Name: z.string().min(1).min(2).max(50),
  TotalBalance: z.string().min(1).max(100),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  // Mutation for adding or updating an expense
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(t("added-successfully"));
      router.push("/");
      Cookies.set(COOKIES_KEYS.ESREFLY_USER_ID, data);
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }
  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center",
        className
      )}
      {...props}
    >
      <Card className="border-none shadow-none w-[90vw] md:w-[500px] md:border md:shadow">
        <CardHeader>
          <CardTitle className="text-2xl">{t("welcome")}</CardTitle>
          <CardDescription>{t("welcome-desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-3xl mx-auto py-10"
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("username")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl>
                          <Input placeholder="" type="text" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="TotalBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("initial-balance")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 400 SR"
                            type="number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  disabled={mutation.isPending}
                  loading={mutation.isPending}
                  type="submit"
                  className="w-full"
                >
                  {t("start")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { formType } from "@/lib/enums";
import { useTranslations } from "next-intl";

interface GoalsFormProps {
  type: formType;
}
const formSchema = z.object({
  incomeSource: z.string().min(1).min(2).max(100),
  amount: z.number(),
  deducedPercentage: z.number().min(0).max(100),
});

const GoalsForm = ({ type }: GoalsFormProps) => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => console.log(values);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">
        {type === formType.add ? t("goals-add") : t("goals-edit")}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="incomeSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("goal-name")}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. new car" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("target-amount")}</FormLabel>
                <FormControl>
                  <Input placeholder="SAR 200.00" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deducedPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("income-deduction-percentage")}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 15%" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t("submit")}</Button>
        </form>
      </Form>
    </div>
  );
};

export default GoalsForm;

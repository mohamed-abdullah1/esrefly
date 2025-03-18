"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { formType } from "@/lib/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addExpense, getExpenseById, updateExpense } from "@/actions/expenses";
import { toast } from "sonner";
import { useEffect } from "react";
import { expensesCategories } from "@/lib/conts";
import { Spinner } from "@/components/loading-spinner";

export const formSchema = z.object({
  title: z.string().min(1).min(2).max(100),
  amount: z.string(),
  category: z.string(),
});

interface ExpenseProps {
  type: formType;
  expenseId?: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ExpenseForm = ({ type, expenseId, setModalOpen }: ExpenseProps) => {
  console.log("🔥✨ ", expenseId);

  const t = useTranslations();
  const queryClient = useQueryClient();
  // Fetch expense data for edit mode
  const { data: expenseData } = useQuery({
    queryKey: ["expenses", expenseId],
    queryFn: () => getExpenseById(expenseId!),
    enabled: !!expenseId, // Only fetch if expenseId is provided
  });
  // Mutation for adding or updating an expense
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      type === formType.add
        ? addExpense(values)
        : updateExpense(expenseId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setModalOpen(false);
      if (type === formType.add) {
        toast.success(t("add-successfully"));
      } else {
        toast.success(t("updated-successfully"));
      }
    },
    onError: (e) => {
      toast.error(t("error"));
      console.error("Error updating expense", e);
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: expenseData?.description || "",
      amount: expenseData?.amount?.toString() || "0",
      category: expenseData?.category || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    mutation.mutate(values);

  // Update form values when expenseData changes
  useEffect(() => {
    if (expenseData) {
      form.reset({
        title: expenseData?.description || "",
        amount: expenseData?.amount?.toString() || "0",
        category: expenseData?.category || "",
      });
    }
  }, [expenseData, form]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">
        {type === formType.add ? t("expenses-add") : t("expenses-edit")}
      </h1>
      {mutation.isPending ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto py-10"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Launch" type="text" {...field} />
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
                  <FormLabel>{t("amount")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SAR 200.00"
                      type="number"
                      {...field}
                      min={0}
                      max={99999}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="e.g. food" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expensesCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {t(category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={mutation.isPending}
              disabled={mutation.isPending}
              type="submit"
            >
              {t("submit")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ExpenseForm;

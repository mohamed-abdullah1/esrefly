"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense, ExpenseItem, updateExpense } from "@/actions/expenses";
import { toast } from "sonner";
import { useEffect } from "react";
import { expensesCategories } from "@/lib/conts";

export const formSchema = z.object({
  title: z.string().min(1).min(2).max(100),
  amount: z.string(),
  category: z.string(),
});

interface ExpenseProps {
  type: formType;
  expense?: ExpenseItem;
  setModalOpen: (value: boolean) => void;
}
const ExpenseForm = ({ type, expense, setModalOpen }: ExpenseProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  // Fetch expense data for edit mode
  // Mutation for adding or updating an expense
  const mutation = useMutation({
    mutationKey: ["expenses"],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (type === formType.add) {
        return addExpense(values);
      } else {
        // Ensure `expense` and `expense.id` are defined before proceeding
        if (!expense?.id) {
          throw new Error("Expense ID is required for updating.");
        }
        return updateExpense(expense.id, values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["metadata"] });
      setModalOpen(false); // Close the modal after successful submission

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
      title: expense?.description || "",
      amount: expense?.amount?.toString() || "0",
      category: expense?.category || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    mutation.mutate(values);

  // Update form values when expenseData changes
  useEffect(() => {
    if (expense) {
      form.reset({
        title: expense?.description || "",
        amount: expense?.amount?.toString() || "0",
        category: expense?.category || "",
      });
    }
  }, [expense, form]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">
        {type === formType.add ? t("expenses-add") : t("expenses-edit")}
      </h1>
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
    </div>
  );
};

export default ExpenseForm;

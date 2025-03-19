"use client";
import { formType } from "@/lib/enums";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIncome, IncomeItem, updateIncome } from "@/actions/incomes";
import { toast } from "sonner";
import { incomeCategories } from "@/lib/conts";

interface IncomeFormProps {
  type: formType;
  income?: IncomeItem;
  setModalOpen: (value: boolean) => void;
}
export const formSchema = z.object({
  incomeSource: z.string().min(1).min(2).max(100),
  amount: z.string(),
  type: z.string(),
});
const IncomeForm = ({ type, income, setModalOpen }: IncomeFormProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (type === formType.add) {
        return addIncome(values);
      } else {
        // Ensure `income` and `income.id` are defined before proceeding
        if (!income?.id) {
          throw new Error("Income ID is required for updating.");
        }
        return updateIncome(income.id, values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setModalOpen(false);
      toast.success(
        type === formType.add
          ? t("add-successfully")
          : t("updated-successfully")
      );
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incomeSource: income?.description || "",
      amount: income?.amount?.toString() || "0",
      type: income?.category || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    mutation.mutate(values);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">
        {type === formType.add ? t("incomes-add") : t("incomes-edit")}
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
                <FormLabel>{t("income-source")}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. salary" type="text" {...field} />
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
                  <Input placeholder="SAR 200.00" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("type")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="e.g. Recurring monthly" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {incomeCategories.map((category) => (
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

export default IncomeForm;

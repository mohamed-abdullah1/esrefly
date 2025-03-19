"use client";
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
import { formType } from "@/lib/enums";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGoal, updateGoal } from "@/actions/goals";
import { toast } from "sonner";

interface GoalsFormProps {
  type: formType;
  setModalOpen: (value: boolean) => void;
  goal?: {
    id: string; // UUID format
    title: string;
    description: string;
    amount: number;
    deductedRatio: number;
    progress: number;
    createdDate: string; // ISO 8601 date string}
  };
}
export const formSchema = z.object({
  title: z.string().min(1).min(2).max(100),
  description: z.string().min(1).min(2).max(100),
  amount: z.string(),
  deductedRatio: z.coerce.number().min(0).max(100), // Ensures a number between 0 and 100
});

const GoalsForm = ({ type, setModalOpen, goal }: GoalsFormProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      if (type === formType.add) {
        return addGoal(values);
      } else {
        // Ensure `goal` and `goal.id` are defined before proceeding
        if (!goal?.id) {
          throw new Error("Goal ID is required for updating.");
        }
        return updateGoal(goal.id, values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["metadata"] });
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
      title: goal?.title || "",
      description: goal?.description || "",
      amount: goal?.amount?.toString() || "0",
      deductedRatio: goal?.deductedRatio || 0,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

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
            name="title"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Description</FormLabel>
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
            name="deductedRatio"
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

export default GoalsForm;

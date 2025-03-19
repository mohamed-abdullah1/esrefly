import React, { useState } from "react";
import { COOKIES_KEYS, formType } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { Container, EllipsisVertical } from "lucide-react";
import format from "@/lib/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { expensesCategories } from "@/lib/conts";
import { deleteExpense, ExpenseItem } from "@/actions/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ExpenseForm from "./expense-form";
import Cookies from "js-cookie";

const Expense = ({
  expense,
}: {
  expense: ExpenseItem;
  setModalOpen: (value: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const t = useTranslations();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteExpense, // Call deleteExpense with the expense ID
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Invalidate the expenses query to refetch data
      queryClient.invalidateQueries({ queryKey: ["metadata"] }); // Invalidate the expenses query to refetch data
      toast.success(t("delete-successfully"));
    },
    onError: (error) => {
      toast.error(t("error"));
      console.error("Delete Error:", error);
    },
  });

  const cat = expensesCategories.find(
    (cat) => cat.name === expense.category
  ) ?? {
    id: 4,
    name: "other",
    icon: <Container className={"text-red-500"} />,
  };
  return expense.description ? (
    <div className="flex justify-between py-2">
      {/* left */}
      <div className="flex gap-4">
        {/* icon */}
        <div
          className={cn(
            "bg-red-100",
            "rounded-full p-2 w-10 h-10",
            "grid place-content-center"
          )}
        >
          {cat?.icon}
        </div>

        {/* category & date */}
        <div className="flex flex-col gap-1">
          <p className={cn("text-lg", "capitalize")}>
            {expense.description.slice(0, 15)}
          </p>
          <div className="flex gap-2">
            <p className="text-xs text-gray-400">
              {new Intl.DateTimeFormat(Cookies.get(COOKIES_KEYS.LOCALIZATION), {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(new Date(expense?.createdDate))}
            </p>

            <p className="text-xs text-gray-400">
              {new Intl.DateTimeFormat(Cookies.get(COOKIES_KEYS.LOCALIZATION), {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(expense?.createdDate))}
            </p>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="flex gap-2">
        {/* price */}

        <p className={cn("text-red-500")}>{format(expense?.amount)}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical />

              <span className="sr-only">options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setOpen(true)}>
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteModal(true)}>
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">{"title"}</DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
              <ExpenseForm
                type={formType.edit}
                setModalOpen={setOpen}
                expense={expense}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <AlertDialog open={deleteModal} onOpenChange={setDeleteModal}>
          <AlertDialogTrigger></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("delete-title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("delete-body")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(expense.id)}
                className="text-white"
              >
                {t("continue")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* 3dots options */}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Expense;

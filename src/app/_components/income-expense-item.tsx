import { IncomeDataType } from "@/lib/types";
import React, { useState } from "react";
import { formType, TYPE } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { CircleSlash, Container, EllipsisVertical } from "lucide-react";
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
import { expensesCategories, incomeCategories } from "@/lib/conts";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteExpense, ExpenseItem } from "@/actions/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface IncomeExpenseProps {
  item: ExpenseItem;
  type: TYPE;
  formComponent: (type: formType, expense?: string) => React.ReactNode;
  isLoading: boolean;
}

const IncomeExpenseItem = ({
  item,
  type,
  isLoading,
  formComponent,
}: IncomeExpenseProps) => {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const t = useTranslations();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteExpense, // Call deleteExpense with the expense ID
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Invalidate the expenses query to refetch data
      toast.success(t("delete-successfully"));
    },
    onError: (error) => {
      toast.error(t("error"));
      console.error("Delete Error:", error);
    },
  });
  console.log("🔥✨ ", { item });

  const cat =
    type === TYPE.INCOME
      ? incomeCategories.find((cat) => cat.name === item.category)
      : expensesCategories.find((cat) => cat.name === item.category) ?? {
          id: 4,
          name: "other",
          icon: (
            <Container
              className={
                (type as TYPE) === TYPE.INCOME
                  ? "text-green-500"
                  : "text-red-500"
              }
            />
          ),
        };
  return item.description ? (
    <div className="flex justify-between py-2">
      {/* left */}
      <div className="flex gap-4">
        {/* icon */}
        {isLoading ? (
          <Skeleton
            className="rounded-full p-2 min-w-10 min-h-10
            grid place-content-center "
          />
        ) : (
          <div
            className={cn(
              TYPE.INCOME === type ? "bg-green-100" : "bg-red-100",
              "rounded-full p-2 w-10 h-10",
              "grid place-content-center"
            )}
          >
            {cat?.icon}
          </div>
        )}

        {/* category & date */}
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <Skeleton className="text-lg capitalize w-24 h-4 rounded" />
          ) : (
            <p className={cn("text-lg", "capitalize")}>{cat?.name}</p>
          )}
          {isLoading ? (
            <Skeleton className="text-xs w-12 h-4 rounded" />
          ) : (
            <p className="text-xs text-gray-400">{t("no-date")}</p>
          )}
        </div>
      </div>
      {/* right */}
      <div className="flex gap-2">
        {/* price */}

        {isLoading ? (
          <Skeleton className="text-green-500 w-12 h-4 rounded" />
        ) : (
          <p
            className={cn(
              TYPE.INCOME === type ? "text-green-500" : "text-red-500"
            )}
          >
            {format(item?.amount)}
          </p>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {!isLoading && (
              <Button variant="ghost" size="icon">
                <EllipsisVertical />

                <span className="sr-only">options</span>
              </Button>
            )}
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
              {formComponent(formType.edit, item.id)}
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
              <AlertDialogAction onClick={() => deleteMutation.mutate(item.id)}>
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

export default IncomeExpenseItem;

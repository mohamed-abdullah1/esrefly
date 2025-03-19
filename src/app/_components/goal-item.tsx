import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import format from "@/lib/currency";
import isSiteArabic from "@/lib/is-site-arabic";
import { EllipsisVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGoal } from "@/actions/goals";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formType } from "@/lib/enums";
import GoalsForm from "./goals-form";
type GoalItem = {
  id: string; // UUID format
  title: string;
  description: string;
  amount: number;
  deductedRatio: number;
  progress: number;
  createdDate: string; // ISO 8601 date string};
};
interface GoalItemProps {
  item: {
    id: string; // UUID format
    title: string;
    description: string;
    amount: number;
    deductedRatio: number;
    progress: number;
    createdDate: string; // ISO 8601 date string};
  };
  setModalOpen: (value: boolean) => void;
}

const GoalItem = ({ item }: GoalItemProps) => {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  const amount = format(item.amount);
  const achieved = format(
    Math.floor(((item.amount * item.progress) / 100) * 100)
  );
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteGoal, // Call deleteIncome with the income ID
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] }); // Invalidate the incomes query to refetch data
      queryClient.invalidateQueries({ queryKey: ["metadata"] }); // Invalidate the incomes query to refetch data
      toast.success(t("delete-successfully"));
    },
    onError: (error) => {
      toast.error(t("error"));
      console.error("Delete Error:", error);
    },
  });

  return (
    <div className="border rounded-lg relative my-2 py-2  px-4 w-full">
      {/* title & deduced percent */}
      <div className="flex justify-between flex-col">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-neutral-400 text-xs">{item.description}</p>
        <div
          className={`absolute top-2 ${
            isSiteArabic() ? "left-5" : "right-5"
          } flex gap-1 items-center`}
        >
          <p
            className={`bg-violet-100 text-violet-500 rounded-full px-3 py-1 text-xs font-bold w-12 h-7 grid place-content-center`}
          >
            {item.deductedRatio}%
          </p>
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
        </div>
      </div>
      {/* progress */}
      <div className="py-4 ">
        <div className="flex justify-between py-2  items-center">
          <p className="text-gray-400 text-sm">{t("progress")}</p>
          <p className="text-sm">
            {achieved}/{amount}
          </p>
        </div>
        <Progress value={item.progress} />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">{"title"}</DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
            <GoalsForm
              type={formType.edit}
              setModalOpen={setOpen}
              goal={item as GoalItem}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteModal} onOpenChange={setDeleteModal}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete-title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("delete-body")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(item.id)}
              className="text-white"
            >
              {t("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoalItem;

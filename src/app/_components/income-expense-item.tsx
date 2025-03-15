import { IncomeDataType } from "@/lib/types";
import React, { useState } from "react";
import { MdLocalGroceryStore } from "react-icons/md";
import { IoReloadCircleSharp } from "react-icons/io5";
import { SiFreelancer } from "react-icons/si";
import { FaShoppingBag } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { TYPE } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { CircleSlash, EllipsisVertical } from "lucide-react";
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

const expensesCategories = [
  {
    id: 1,
    name: "groceries",
    icon: <MdLocalGroceryStore className="text-red-500 w-5 h-5" />,
  },
  {
    id: 2,
    name: "shopping",
    icon: <FaShoppingBag className="text-red-500 w-5 h-5" />,
  },
  {
    id: 3,
    name: "restaurant",
    icon: <MdRestaurant className="text-red-500 w-5 h-5" />,
  },
];

const incomeCategories = [
  {
    id: 1,
    name: "recurring",
    icon: <IoReloadCircleSharp className="text-green-500 w-5 h-5" />,
  },
  {
    id: 2,
    name: "one-off",
    icon: <SiFreelancer className="text-green-500 w-5 h-5" />,
  },
];

interface IncomeExpenseProps {
  item: IncomeDataType;
  type: TYPE;
  formComponent: React.ReactNode;
}

const IncomeExpenseItem = ({
  item,
  type,
  formComponent,
}: IncomeExpenseProps) => {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const t = useTranslations();
  console.log("🔥✨ ", { item });

  const cat =
    type === TYPE.INCOME
      ? incomeCategories.find((cat) => cat.id === item.categoryId)
      : expensesCategories.find((cat) => cat.id === item.categoryId) ?? {
          id: 33,
          name: "other",
          icon: (
            <CircleSlash
              className={cn(
                (type as TYPE.INCOME) ? "text-green-500" : "text-red-500"
              )}
            />
          ),
        };

  return item.title ? (
    <div className="flex justify-between py-2">
      {/* left */}
      <div className="flex gap-4">
        {/* icon */}
        <div
          className={cn(
            TYPE.INCOME === type ? "bg-green-100" : "bg-red-100",
            "rounded-full p-2 w-10 h-10",
            "grid place-content-center"
          )}
        >
          {cat?.icon}
        </div>
        {/* category & date */}
        <div className="flex flex-col gap-0">
          <p className={cn("text-lg", "capitalize")}>{cat?.name}</p>
          <p className="text-xs text-gray-400">{item?.date}</p>
        </div>
      </div>
      {/* right */}
      <div className="flex gap-2">
        {/* price */}
        <p
          className={cn(
            TYPE.INCOME === type ? "text-green-500" : "text-red-500"
          )}
        >
          {format(parseInt(item?.amount))}
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">{"title"}</DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
              {formComponent}
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
              <AlertDialogAction>{t("continue")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* 3dots options */}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default IncomeExpenseItem;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import isSiteArabic from "@/lib/is-site-arabic";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { formType } from "@/lib/enums";
import React from "react";
import { ExpenseItem, fetchExpenses } from "@/actions/expenses";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import ExpenseForm from "./expense-form";
import Expense from "./expense-item";

const ExpenseContainer = () => {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data: expenses, isPending } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    refetchOnWindowFocus: false,
  });
  console.log("🔥✨ ", { expenses });

  return (
    <Card className="w-full relative h-full">
      <CardHeader>
        <CardTitle className="text-xl lg:text-3xl">{t("expenses")}</CardTitle>
        <CardDescription>{t("expenses-desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger>
            <Button
              className={`absolute top-5 rounded-full text-white ${
                isSiteArabic() ? "left-5" : "right-5"
              }`}
            >
              <Plus className="w-6 h-6 font-bold" />
              {t("add")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">{t("expenses-add")}</DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
              <div>
                <ExpenseForm
                  type={formType.add}
                  setModalOpen={setModalOpen}
                  expense={undefined}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col">
          {isPending ? (
            <div className="grid place-content-center ">
              <Spinner className="!w-7 !h-7 !border-[3px] " />
            </div>
          ) : Array.isArray(expenses?.data) && expenses.data.length > 0 ? (
            expenses?.data?.map((expense) => (
              <Expense
                key={expense.id}
                expense={expense as ExpenseItem}
                setModalOpen={setModalOpen}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <p className="text-center text-gray-800">{t("no-data") + "🥲"}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default ExpenseContainer;

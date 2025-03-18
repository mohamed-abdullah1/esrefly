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
import { formType, TYPE } from "@/lib/enums";
import IncomeExpenseItem from "./income-expense-item";
import { GoalDataType, IncomeDataType } from "@/lib/types";
import GoalItem from "./goal-item";
import React from "react";
import { ExpenseItem } from "@/actions/expenses";
import { Spinner } from "@/components/ui/spinner";

interface ItemsContainerProps {
  title: string;
  formComponent: (
    type: formType,
    expenseId?: string,
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.JSX.Element;
  data: ExpenseItem[];
  type: TYPE;
  isLoading: boolean;
}

const ItemsContainer = ({
  title,
  formComponent,
  data,
  type,
  isLoading,
}: ItemsContainerProps) => {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = React.useState(false);
  console.log("🔥✨ DATA", data);

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription></CardDescription>
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
              <DialogTitle className="sr-only">{title}</DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
              <div>{formComponent(formType.add, undefined, setModalOpen)}</div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col">
          {[TYPE.INCOME, TYPE.EXPENSE].includes(type) && isLoading ? (
            <div className="grid place-content-center">
              <Spinner className="!w-7 !h-7 !border-[3px]" />
            </div>
          ) : data.length > 0 ? (
            data.map((item) => (
              <IncomeExpenseItem
                key={item.id}
                item={item as ExpenseItem}
                type={type}
                formComponent={formComponent}
                isLoading={isLoading}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <p className="text-center text-gray-800">{t("no-data") + "🥲"}</p>
            </div>
          )}
          <div className="md:grid md:grid-cols-2 md:gap-4">
            {TYPE.GOAL === type &&
              data.map((item) => (
                <GoalItem key={item.id} item={item as GoalDataType} />
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default ItemsContainer;

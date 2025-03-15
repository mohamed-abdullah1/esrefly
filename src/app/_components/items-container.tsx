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
import { TYPE } from "@/lib/enums";
import IncomeExpenseItem from "./income-expense-item";
import { GoalDataType, IncomeDataType } from "@/lib/types";
import GoalItem from "./goal-item";

interface ItemsContainerProps {
  title: string;
  formComponent: React.ReactNode;
  data: IncomeDataType[] | GoalDataType[];
  type: TYPE;
}

const ItemsContainer = ({
  title,
  formComponent,
  data,
  type,
}: ItemsContainerProps) => {
  const t = useTranslations();
  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
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
              {formComponent}
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col">
          {[TYPE.INCOME, TYPE.EXPENSE].includes(type) &&
            data.map((item) => (
              <IncomeExpenseItem
                key={item.id}
                item={item as IncomeDataType}
                type={type}
                formComponent={formComponent}
              />
            ))}
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

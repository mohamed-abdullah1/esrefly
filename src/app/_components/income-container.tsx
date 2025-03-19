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
import { IncomeItem, fetchIncomes } from "@/actions/incomes";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import IncomeForm from "./income-form";
import Income from "./income-item";

const IncomeContainer = () => {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data: incomes, isPending } = useQuery({
    queryKey: ["incomes"],
    queryFn: fetchIncomes,
  });

  return (
    <Card className="w-full relative h-full">
      <CardHeader>
        <CardTitle className="text-xl lg:text-3xl">{t("incomes")}</CardTitle>
        <CardDescription>{t("incomes-desc")}</CardDescription>
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
              <DialogTitle className="sr-only">{t("incomes-add")}</DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
              <div>
                <IncomeForm
                  type={formType.add}
                  setModalOpen={setModalOpen}
                  income={undefined}
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
          ) : Array.isArray(incomes?.data) && incomes.data.length > 0 ? (
            incomes?.data?.map((income) => (
              <Income
                key={income.id}
                income={income as IncomeItem}
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

export default IncomeContainer;

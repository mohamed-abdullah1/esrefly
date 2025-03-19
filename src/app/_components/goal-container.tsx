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
import { fetchGoals } from "@/actions/goals";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import GoalForm from "./goals-form";
import Goal from "./goal-item";

type GoalItem = {
  id: string; // UUID format
  title: string;
  description: string;
  amount: number;
  deductedRatio: number;
  progress: number;
  createdDate: string; // ISO 8601 date string
};

const GoalContainer = () => {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data: goals, isPending } = useQuery({
    queryKey: ["goals"],
    queryFn: fetchGoals,
  });

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="text-xl lg:text-3xl">{t("goals")}</CardTitle>
        <CardDescription>{t("goals-desc")}</CardDescription>
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
              <DialogTitle className="sr-only">{t("goals-add")}</DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
              <div>
                <GoalForm
                  type={formType.add}
                  setModalOpen={setModalOpen}
                  goal={undefined}
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
          ) : Array.isArray(goals?.data) && goals.data.length > 0 ? (
            goals?.data?.map((goal) => (
              <Goal
                key={goal.id}
                item={goal as GoalItem}
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

export default GoalContainer;

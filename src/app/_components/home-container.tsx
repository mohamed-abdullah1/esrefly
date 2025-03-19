"use client";
import AmountCard from "@/app/_components/amount-card";
import { useTranslations } from "next-intl";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { MdSavings } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { fetchMetadata } from "@/actions/incomes";
import ExpenseContainer from "./expense-container";
import IncomeContainer from "./income-container";
import GoalContainer from "./goal-container";
import { Spinner } from "@/components/ui/spinner";

const HomeContainer = () => {
  const t = useTranslations();

  const { data: metadata, isPending: metaDataIsPending } = useQuery({
    queryKey: ["metadata"],
    queryFn: fetchMetadata,
  });
  const data = [
    {
      id: 1,
      title: t("total-income"),
      desc: `+${0}% ${t("from-last-month")}`,
      descClassName: "text-green-500",
      amount: (metadata?.data.totalIncome || 0).toString(),
      icon: (
        <FaArrowTrendUp className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-green-500" />
      ),
    },
    {
      id: 2,
      title: t("total-expenses"),
      desc: `-${0}% ${t("from-last-month")}`,
      descClassName: "text-red-500",
      amount: (metadata?.data.totalExpense || 0).toString(),
      icon: (
        <FaArrowTrendDown className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-red-500" />
      ),
    },

    {
      id: 3,
      title: t("savings"),
      desc: `+${0}% ${t("from-last-month")}`,
      descClassName: "text-blue-500",
      amount: (metadata?.data.totalBalance || 0).toString(),
      icon: (
        <MdSavings className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-blue-500" />
      ),
    },
    {
      id: 4,
      title: t("goal-progress"),
      desc: `${0} ${t("of")} ${8} ${t("goals-achieved")}`,
      descClassName: "text-violet-500",
      amount: (metadata?.data.goalProgress || 0) + "%",
      icon: (
        <GoGoal className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-violet-500" />
      ),
    },
  ];

  return (
    <div>
      {/* CARDS SECTION */}
      <h2 className="text-3xl font-semibold text-start  w-full">
        {t("overview")}
      </h2>
      <section className="flex flex-col gap-4 items-center md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 py-12">
        {metaDataIsPending ? (
          <div className="grid place-content-center ">
            <Spinner className="!w-7 !h-7 !border-[3px] " />
          </div>
        ) : (
          data.map((item) => <AmountCard key={item.id} {...item} />)
        )}
      </section>
      <h2 className="text-3xl font-semibold text-start  w-full">
        {t("details")}
      </h2>
      <section className="flex flex-col gap-4 items-start md:grid md:grid-cols-2  md:gap-4 py-12">
        <ExpenseContainer />
        <IncomeContainer />
        <GoalContainer />
      </section>
    </div>
  );
};

export default HomeContainer;

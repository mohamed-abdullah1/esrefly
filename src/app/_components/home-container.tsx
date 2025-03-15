"use client";
import AmountCard from "@/app/_components/amount-card";
import { useTranslations } from "next-intl";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { MdSavings } from "react-icons/md";
import ItemsContainer from "./items-container";
import ExpenseForm from "./expense-form";
import IncomeForm from "./income-form";
import GoalsForm from "./goals-form";
import { TYPE } from "@/lib/enums";

const HomeContainer = () => {
  const t = useTranslations();
  const data = [
    {
      id: 1,
      title: t("total-income"),
      desc: `+${12}% ${t("from-last-month")}`,
      descClassName: "text-green-500",
      amount: "12000",
      icon: (
        <FaArrowTrendUp className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-green-500" />
      ),
    },
    {
      id: 2,
      title: t("total-expenses"),
      desc: `-${5}% ${t("from-last-month")}`,
      descClassName: "text-red-500",
      amount: "7340",
      icon: (
        <FaArrowTrendDown className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-red-500" />
      ),
    },

    {
      id: 3,
      title: t("savings"),
      desc: `+${11}% ${t("from-last-month")}`,
      descClassName: "text-blue-500",
      amount: "1999",
      icon: (
        <MdSavings className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-blue-500" />
      ),
    },
    {
      id: 4,
      title: t("goal-progress"),
      desc: `${5} ${t("of")} ${8} ${t("goals-achieved")}`,
      descClassName: "text-violet-500",
      amount: "69%",
      icon: (
        <GoGoal className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-violet-500" />
      ),
    },
  ];

  const expensesData = [
    {
      id: 1,
      title: "Rent Payment",
      amount: "2000",
      categoryId: 1,
      date: "March 2,2025",
    },
    {
      id: 2,
      title: "Buying Chips",
      amount: "40",
      categoryId: 2,
      date: "Today",
    },
    {
      id: 3,
      title: "Fuel car",
      amount: "40",
      categoryId: 3,
      date: "Yesterday",
    },
  ];

  const incomeData = [
    {
      id: 1,
      title: "Salary",
      amount: "2000",
      categoryId: 1,
      date: "March 2,2025",
    },
    {
      id: 2,
      title: "Freelance job",
      amount: "40",
      categoryId: 2,
      date: "Today",
    },
    { id: 3, title: "Gift", amount: "40", categoryId: 3, date: "Yesterday" },
  ];
  const goalsData = [
    {
      id: 1,
      title: "New Car",
      amount: "20000",
      deducePercentage: "13",
      progress: 50,
    },
    {
      id: 2,
      title: "Mac book m2",
      amount: "50000",
      deducePercentage: "20",
      progress: 23,
    },
  ];

  const itemsData = [
    {
      id: 1,
      title: t("expenses"),
      formComponent: <ExpenseForm />,
      data: expensesData,
      type: TYPE.EXPENSE,
    },
    {
      id: 2,
      title: t("incomes"),
      formComponent: <IncomeForm />,
      data: incomeData,
      type: TYPE.INCOME,
    },
    {
      id: 3,
      title: t("goals"),
      formComponent: <GoalsForm />,
      data: goalsData,
      type: TYPE.GOAL,
    },
  ];

  return (
    <div>
      {/* CARDS SECTION */}
      <h2 className="text-3xl font-semibold text-start  w-full">
        {t("overview")}
      </h2>
      <section className="flex flex-col gap-4 items-center md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 py-12">
        {data.map((item) => (
          <AmountCard key={item.id} {...item} />
        ))}
      </section>
      <h2 className="text-3xl font-semibold text-start  w-full">
        {t("details")}
      </h2>
      <section className="flex flex-col gap-4 items-center md:grid md:grid-cols-2  md:gap-4 py-12">
        {itemsData.map((item) => (
          <ItemsContainer key={item.id} {...item} />
        ))}
      </section>
    </div>
  );
};

export default HomeContainer;

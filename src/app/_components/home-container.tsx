"use client";
import AmountCard from "@/app/_components/amount-card";
import { useTranslations } from "next-intl";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { MdSavings } from "react-icons/md";

const HomeContainer = () => {
  const t = useTranslations();
  const data = [
    {
      id: 1,
      title: t("total-income"),
      desc: `+${12}% ${t("from-last-month")}`,
      descClassName: "text-green-500",
      amount: "$12,000",
      icon: (
        <FaArrowTrendUp className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-green-500" />
      ),
    },
    {
      id: 2,
      title: t("total-expenses"),
      desc: `-${5}% ${t("from-last-month")}`,
      descClassName: "text-red-500",
      amount: "$7,340",
      icon: (
        <FaArrowTrendDown className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-red-500" />
      ),
    },

    {
      id: 3,
      title: t("savings"),
      desc: `+${11}% ${t("from-last-month")}`,
      descClassName: "text-blue-500",
      amount: "$1,999",
      icon: (
        <MdSavings className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-blue-500" />
      ),
    },
    {
      id: 4,
      title: t("goal-progress"),
      desc: `${5} of ${8} ${t("goals-achieved")}`,
      descClassName: "text-violet-500",
      amount: "69%",
      icon: (
        <GoGoal className="h-[1.8rem] w-[1.8rem] rotate-0 scale-100 transition-all  text-violet-500" />
      ),
    },
  ];

  return (
    <div>
      {/* CARDS SECTION */}
      <section className="flex flex-col gap-4 items-center md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 ">
        {data.map((item) => (
          <AmountCard key={item.id} {...item} />
        ))}
      </section>
    </div>
  );
};

export default HomeContainer;

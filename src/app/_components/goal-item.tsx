import { Progress } from "@/components/ui/progress";
import format from "@/lib/currency";
import isSiteArabic from "@/lib/is-site-arabic";
import { GoalDataType } from "@/lib/types";
import { useTranslations } from "next-intl";
import React from "react";

interface GoalItemProps {
  item: GoalDataType;
}

const GoalItem = ({ item }: GoalItemProps) => {
  const t = useTranslations();
  const amount = format(parseInt(item.amount));
  const total = format(
    Math.floor((parseInt(item.amount) / item.progress) * 100)
  );
  return (
    <div className="border rounded-lg relative my-2 p-4 w-full">
      {/* title & deduced percent */}
      <div className="flex justify-between">
        <h3 className="font-semibold">{item.title}</h3>
        <p
          className={`absolute top-4 ${
            isSiteArabic() ? "left-5" : "right-5"
          } bg-violet-100 text-violet-500 rounded-full px-3 py-1 text-xs font-bold`}
        >
          {item.deducePercentage}%
        </p>
      </div>
      {/* progress */}
      <div className="py-4 ">
        <div className="flex justify-between py-2  items-center">
          <p className="text-gray-400 text-sm">{t("progress")}</p>
          <p className="text-sm">
            {amount}/{total}
          </p>
        </div>
        <Progress value={item.progress} />
      </div>
    </div>
  );
};

export default GoalItem;

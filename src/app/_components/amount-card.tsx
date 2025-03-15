import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import format from "@/lib/currency";
import isSiteArabic from "@/lib/is-site-arabic";

interface AmountCardProps {
  title: string;
  desc: string;
  amount: string;
  icon: React.ReactNode;
  descClassName: string;
}

const AmountCard = ({
  title,
  desc,
  amount,
  icon,
  descClassName,
}: AmountCardProps) => {
  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {amount.includes("%") ? amount : format(parseInt(amount))}
        </p>

        <div
          className={`absolute top-5 ${isSiteArabic() ? "left-5" : "right-5"}`}
        >
          {icon}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className={descClassName}>{desc}</div>
      </CardFooter>
    </Card>
  );
};

export default AmountCard;

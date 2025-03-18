import { Container } from "lucide-react";
import { FaShoppingBag } from "react-icons/fa";
import { IoReloadCircleSharp } from "react-icons/io5";
import { MdLocalGroceryStore, MdRestaurant } from "react-icons/md";
import { SiFreelancer } from "react-icons/si";

export const expensesCategories = [
  {
    id: 1,
    name: "groceries",
    icon: <MdLocalGroceryStore className="text-red-500 w-5 h-5" />,
  },
  {
    id: 2,
    name: "shopping",
    icon: <FaShoppingBag className="text-red-500 w-5 h-5" />,
  },
  {
    id: 3,
    name: "restaurant",
    icon: <MdRestaurant className="text-red-500 w-5 h-5" />,
  },
  {
    id: 4,
    name: "other",
    icon: <Container className={"text-red-500"} />,
  },
];

export const incomeCategories = [
  {
    id: 1,
    name: "recurring",
    icon: <IoReloadCircleSharp className="text-green-500 w-5 h-5" />,
  },
  {
    id: 2,
    name: "one-off",
    icon: <SiFreelancer className="text-green-500 w-5 h-5" />,
  },
  {
    id: 4,
    name: "other",
    icon: <Container className={"text-red-500"} />,
  },
];

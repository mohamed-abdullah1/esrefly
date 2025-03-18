"use server";

import { formSchema } from "@/app/_components/expense-form";
import { COOKIES_KEYS } from "@/lib/enums";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

import { z } from "zod";

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: string | null; // category can be a string or null
}
type ExpensesResponse = {
  data: ExpenseItem[];
  success: boolean;
};

export const fetchExpenses = async (
  context: QueryFunctionContext<["expenses"]>
): Promise<ExpensesResponse> => {
  console.log("🔥✨ ", context);
  const cookieStore = await cookies();

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Expenses/user/` +
        cookieStore.get(COOKIES_KEYS.ESREFLY_USER_ID)?.value
    );
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    // You can customize the error object structure
    const enhancedError = {
      // message: axiosError.message,
      // status: axiosError.response?.status,
      data: axiosError.response?.data as ExpenseItem[],
      success: false,
    };
    console.error("Error fetching data:", error);
    return enhancedError;
  }
};

export const addExpense = async (data: z.infer<typeof formSchema>) => {
  const { amount, title, category } = data;
  try {
    const cookieStore = await cookies();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Expenses`,
      {
        amount: Number(amount),
        description: title,
        category: category,
        userId: cookieStore.get(COOKIES_KEYS.ESREFLY_USER_ID)?.value,
      }
    );
    console.log("🔥✨ ", res);
    return res.data;
  } catch (e: any) {
    console.log("🔥✨ ", e);

    throw e.response?.data || e.message;
  }
};

export const getExpenseById = async (id: string): Promise<ExpenseItem> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Expenses/${id}`
    );
    console.log("🔥✨ Get Expense By ID Response:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("🔥✨ Get Expense By ID Error:", axiosError);
    throw axiosError.response?.data || axiosError.message;
  }
};

export const updateExpense = async (
  id: string,
  data: z.infer<typeof formSchema>
) => {
  const { amount, title, category } = data;

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Expenses/${id}`,
      {
        description: title, // Map 'title' from form to 'description' in the backend
        amount: Number(amount), // Ensure amount is a number
        category: category, // Include category
      }
    );

    console.log("🔥✨ Update Expense Response:", { d: res.data });
    return { d: "done", isSuccess: true };
  } catch (e: any) {
    const axiosError = e as AxiosError;
    console.error("🔥✨ Update Expense Error:", axiosError);

    // Throw the error response data or a generic error message
    throw axiosError.response?.data || axiosError.message;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Expenses/${id}`
    );

    console.log("🔥✨ Delete Expense Response:", res.data);
    return res.data; // Return the response data if needed
  } catch (e: any) {
    const axiosError = e as AxiosError;
    console.error("🔥✨ Delete Expense Error:", axiosError);

    // Throw the error response data or a generic error message
    throw axiosError.response?.data || axiosError.message;
  }
};

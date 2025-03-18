"use server";

import { formSchema } from "@/app/_components/income-form";
import { COOKIES_KEYS } from "@/lib/enums";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

import { z } from "zod";

export interface IncomeItem {
  id: string;
  description: string;
  amount: number;
  category: string | null; // category can be a string or null
}
type IncomesResponse = {
  data: IncomeItem[];
  success: boolean;
};

export const fetchIncomes = async (
  context: QueryFunctionContext<["incomes"]>
): Promise<IncomesResponse> => {
  console.log("🔥✨ ", context);
  const cookieStore = await cookies();

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Incomes/user/` +
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
      data: axiosError.response?.data as IncomeItem[],
      success: false,
    };
    console.error("Error fetching data:", error);
    return enhancedError;
  }
};

export const addIncome = async (data: z.infer<typeof formSchema>) => {
  const { amount, incomeSource: description, type: incomeType } = data;
  try {
    const cookieStore = await cookies();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Incomes`,
      {
        amount: Number(amount),
        description,
        incomeType,
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

export const getIncomeById = async (id: string): Promise<IncomeItem> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Incomes/${id}`
    );
    console.log("🔥✨ Get Income By ID Response:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("🔥✨ Get Income By ID Error:", axiosError);
    throw axiosError.response?.data || axiosError.message;
  }
};

export const updateIncome = async (
  id: string,
  data: z.infer<typeof formSchema>
) => {
  const cookieStore = await cookies();

  const { amount, incomeSource: description, type: incomeType } = data;

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Incomes/${id}`,
      {
        amount: Number(amount),
        description,
        incomeType,
        userId: cookieStore.get(COOKIES_KEYS.ESREFLY_USER_ID)?.value,
      }
    );

    console.log("🔥✨ Update Income Response:", res.data);
    return res.data;
  } catch (e: any) {
    const axiosError = e as AxiosError;
    console.error("🔥✨ Update Income Error:", axiosError);

    // Throw the error response data or a generic error message
    throw axiosError.response?.data || axiosError.message;
  }
};

export const deleteIncome = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Incomes/${id}`
    );

    console.log("🔥✨ Delete Income Response:", res.data);
    return res.data; // Return the response data if needed
  } catch (e: any) {
    const axiosError = e as AxiosError;
    console.error("🔥✨ Delete Income Error:", axiosError);

    // Throw the error response data or a generic error message
    throw axiosError.response?.data || axiosError.message;
  }
};

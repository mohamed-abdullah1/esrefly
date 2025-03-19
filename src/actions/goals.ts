"use server";

import { formSchema } from "@/app/_components/goals-form";
import { COOKIES_KEYS } from "@/lib/enums";
import axios from "axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

import { z } from "zod";

export interface GoalItem {
  id: string; // UUID format
  title: string;
  description: string;
  amount: number;
  deductedRatio: number;
  progress: number;
  createdDate: string; // ISO 8601 date string
}
type GoalsResponse = {
  data: GoalItem[];
  success: boolean;
};

export const fetchGoals = async (): Promise<GoalsResponse> => {
  const cookieStore = await cookies();

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Goals/user/` +
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
      data: axiosError.response?.data as GoalItem[],
      success: false,
    };
    return enhancedError;
  }
};

export const addGoal = async (data: z.infer<typeof formSchema>) => {
  try {
    const cookieStore = await cookies();
    const { amount, deductedRatio, ...rest } = data;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Goals`,
      {
        amount: Number(amount),
        deductedRatio: Number(deductedRatio),
        ...rest,
        userId: cookieStore.get(COOKIES_KEYS.ESREFLY_USER_ID)?.value,
      }
    );
    return res.data;
  } catch (e) {
    throw (e as AxiosError).response?.data || (e as Error).message;
  }
};

export const getGoalById = async (id: string): Promise<GoalItem> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Goals/${id}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || axiosError.message;
  }
};

export const updateGoal = async (
  id: string,
  data: z.infer<typeof formSchema>
) => {
  const cookieStore = await cookies();
  const { amount, deductedRatio, ...rest } = data;

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Goals/${id}`,
      {
        amount: Number(amount),
        deductedRatio: Number(deductedRatio),
        ...rest,
        userId: cookieStore.get(COOKIES_KEYS.ESREFLY_USER_ID)?.value,
      }
    );

    return res.data;
  } catch (e) {
    const axiosError = e as AxiosError;
    // Throw the error response data or a generic error message
    throw axiosError.response?.data || axiosError.message;
  }
};

export const deleteGoal = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/Goals/${id}`
    );

    return res.data; // Return the response data if needed
  } catch (e) {
    const axiosError = e as AxiosError;

    // Throw the error response data or a generic error message
    throw axiosError.response?.data || axiosError.message;
  }
};

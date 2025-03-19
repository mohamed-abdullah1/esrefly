"use client";

import axios from "axios";
import { z } from "zod";
import { formSchema } from "./_components/login-form";

export const loginUser = async (data: z.infer<typeof formSchema>) => {
  try {
    const { TotalBalance, id, Name } = data;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/users`,

      {},
      {
        params: { TotalBalance: Number(TotalBalance), Id: id, Name },
      }
    );
    console.log("🔥✨ ", res);
    return res.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("🔥✨ ", e);

      throw e.response?.data || e.message;
    } else {
      console.error("🔥✨ ", e);

      throw (e as Error).message;
    }
  }
};

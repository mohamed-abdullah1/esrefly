import { getQueryClient } from "@/lib/react-query";
import HomeContainer from "./_components/home-container";
import { fetchExpenses } from "@/actions/expenses";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
  return (
    <main className="container mx-auto !py-0">
      <HomeContainer />
    </main>
  );
}

import { getAllAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TransactionTable from "../_components/transactionsTable";
import { BarLoader } from "react-spinners";
import ChartTable from "../_components/chartTable";

interface AccountPageProps {
  params: { id: string };
}

const Page = async ({ params }: AccountPageProps) => {
  const { id } = await params;
  const accountData = await getAllAccountWithTransactions(id);
  // console.log(accountData);

  // If no account data is found, return a 404 page
  if (!accountData) {
    notFound();
  }

  const { ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className=" flex  gap-4  items-end justify-between">
        <div className="">
          <h1
            id={account.name.toLowerCase()}
            className="text-2xl sm:text-4xl md:5xl text-primary font-extrabold tracking-wide pb-2"
          >
            {account.name.toUpperCase()}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>
        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-semibold">
            ${parseFloat(account.balance.toString()).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* chart section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="green" />}
      >
        <ChartTable transactions={account.transactions}/>
      </Suspense>
      {/* Transaction Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="green" />}
      >
        <TransactionTable transaction={account.transactions} />
      </Suspense>
    </div>
  );
};

export default Page;

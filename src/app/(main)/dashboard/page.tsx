import { GetUserAccount } from "@/actions/account";
import CreateAccountDrawer from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@prisma/client";
import { Plus } from "lucide-react";
import AccountCard from "./_components/accountCard";

async function DashboardPage() {
  const accounts = await GetUserAccount();
  // console.log(Object.values(accounts?.data));

  return (
    <div >
      {/* Your dashboard content here */}
      {/*  */}
      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow bg-primary-foreground cursor-pointer border-2 h-full flex justify-center items-center">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
              <Plus className="h-10 w-10 mb-2 text-center" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts?.data &&
          Object.values(accounts.data).map((account) => {
            return (
              <AccountCard
                key={(account as Account).id}
                account={account as Account}
              />
            );
          })}
      </div>
    </div>
  );
}

export default DashboardPage;

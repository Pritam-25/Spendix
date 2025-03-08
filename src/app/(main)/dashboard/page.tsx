export const dynamic = "force-dynamic"; // ✅ Forces dynamic rendering


import { GetUserAccount } from "@/actions/account";
import CreateAccountDrawer from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@prisma/client";
import { Plus } from "lucide-react";
import AccountCard from "./_components/accountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budgetProgress";


async function DashboardPage() {
  try {
    // * find all accounts
    const accounts = await GetUserAccount();
    
    if (!accounts?.data) {
      console.error("Failed to load accounts data");
      return <div>Error loading accounts. Please try again.</div>;
    }
    
    // * find the default account
    const defaultAccount = accounts.data.find((account) => account.isDefault);
    
    // * find budget
    let budgetData = null;
    if (defaultAccount) {
      try {
        budgetData = await getCurrentBudget(defaultAccount.id);
      } catch (error) {
        console.error("Failed to load budget data:", error);
      }
    }

    return (
      <div>
        {/* Budget Progress */}
        {defaultAccount && (
          <BudgetProgress 
            initialBudget={budgetData?.budget} 
            currentExpense={budgetData?.currentExpense} 
          />
        )}
        
        {/* Accounts Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow bg-secondary cursor-pointer border-2 border-dashed h-full flex justify-center items-center pt-8 pb-4">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
                <Plus className="h-10 w-10 mb-2 text-center" />
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          
          {accounts.data.map((account: Account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in dashboard page:", error);
  }
}

export default DashboardPage;
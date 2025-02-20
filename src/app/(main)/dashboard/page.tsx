import CreateAccountDrawer from "@/components/createAccountDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      {/* Your dashboard content here */}
      {/*  */}
      {/* Accounts Grid */}
      <div>
        <CreateAccountDrawer>
          <div className="grid gap-4 md: grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2">
              <CardContent className="flex flex-col items-center justify-center h-full pt-5 text-muted-foreground">
                <Plus className="h-10 w-10 mb-2 text-center" />
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </div>
        </CreateAccountDrawer>
      </div>
    </div>
  );
}

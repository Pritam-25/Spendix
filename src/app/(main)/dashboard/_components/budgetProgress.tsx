"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import useFetch from "@/app/hooks/useFetch";
import { updateBudget } from "@/actions/budget";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function BudgetProgress({
  initialBudget,
  currentExpense,
}: {
  initialBudget: any;
  currentExpense: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const percentUsed = initialBudget?.amount
    ? (currentExpense / initialBudget.amount) * 100
    : 0;

  // console.log(initialBudget);
  // console.log(`currentExpense: ${currentExpense}`);

  // console.log(`percentage: ${percentUsed}`);

  const {
    loading: islLoading,
    fetchData: updateBudgetFn,
    data: updatedBudgetData,
    error,
  } = useFetch(updateBudget);

  //*  update the budget
  const handleUpdateChange = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  //*  if budget updated succesfully show  success toast
  useEffect(() => {
    if (updatedBudgetData?.success) {
      setIsEditing(false);
      setTimeout(() => {
        toast.success("Budget updated successfully");
      }, 0);
    }
  }, [updatedBudgetData]);

  //*  if budget not updated succesfully show error toast
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error((error as Error).message || "Failed to update budget");
      }, 0);
    }
  }, [error]);

  //*   cancel updating budget
  const handleCancel = () => {
    setNewBudget(initialBudget?.amount.toString() || "");
    setIsEditing(false);
  };

  return (
    <Card className="mb-10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-md font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1 pt-3">
            {isEditing ? (
              <div className="flex gap-4">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={islLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateChange(); // call update function when enter is press
                    }
                  }}
                />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={handleUpdateChange}
                  disabled={islLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant={"ghost"} size={"icon"} onClick={handleCancel}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-base font-medium">
                  {initialBudget
                    ? `Spent  $${currentExpense.toFixed(
                        2
                      )} of $${initialBudget.amount.toFixed(2)}`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setIsEditing(true)}
                  disabled={islLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={percentUsed} className="h-2" />
        <div className="flex justify-end mt-1">
          <p className="text-xs text-muted-foreground">
            {percentUsed.toFixed(1)}% used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

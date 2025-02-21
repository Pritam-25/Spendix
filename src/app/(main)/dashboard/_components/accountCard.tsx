"use client";

import { updateDefaultAccount } from "@/actions/account";
import useFetch from "@/app/hooks/useFetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { Account } from "@prisma/client";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AccountCard({ account }: { account: Account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    data: updatedAccount,
    error,
    fetchData: updateDefaultFn,
    loading: createAccountLoading,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      setTimeout(() => {
        toast.success("Default account updated succesfully");
      }, 0);
    }
  }, [updateDefaultAccount, updatedAccount]);

  useEffect(() => {
    if (updatedAccount?.success) {
      setTimeout(() => {
        toast.error(
          (error as Error).message || "Default account updated succesfully"
        );
      }, 0);
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex justify-between flex-row space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={createAccountLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance.toString()).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

"use client";

import React, { useEffect } from "react";
import { createTransaction } from "@/actions/transaction";
import useFetch from "@/app/hooks/useFetch";
import { TransactionFormType, transactionSchema } from "@/app/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account, RecurringInterval, Transaction } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CreateAccountDrawer from "@/components/createAccountDrawer";
import { Button } from "@/components/ui/button";
import { defaultCategories } from "@/data/categories";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar1Icon, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReceiptScanner from "./receiptScanner";

export default function AddTransactionForm({
  accounts,
  category,
}: {
  accounts: Account[];
  category: typeof defaultCategories;
}) {
  // next router
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<TransactionFormType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      category: "",
      accountId:
        accounts.find((account: Account) => account.isDefault)?.id || "",
      date: new Date(),
      isRecurring: false,
      recurringInterval: RecurringInterval.MONTHLY, // Default recurring interval
    },
  });

  const {
    fetchData: transactionFn,
    loading: transactionLoading,
    data: transactionResult,
  } = useFetch(createTransaction);

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const selectType = watch("type");
  const isRecurring = watch("isRecurring");

  const filteredCategories = category.filter(
    (category) => category.type === selectType
  );

  const onSubmit = async (data: TransactionFormType) => {
    const formData = {
      ...data,
      amount: data.amount.toString(), // Convert to string
    };

    transactionFn(formData);
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      setTimeout(() => {
        toast.success("Transaction created successfully.");
      }, 0); // Slight delay

      router.refresh(); // Ensure the page updates
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, router]);


    const handleScanComplete = (scannedData: any) =>{

    }

  return (
    <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>

      {/* AI receipt scanner */}
      <ReceiptScanner/>

      {/* Type */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-muted-foreground"
        >
          Type
        </label>
        <div className="mt-1">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full" id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.type && (
          <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-muted-foreground"
          >
            Amount
          </label>
          <div className="mt-1">
            <Input
              {...register("amount")}
              type="number"
              id="amount"
              step="0.01"
              placeholder="0.00"
              className="w-full"
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Account */}
        <div>
          <label
            htmlFor="account"
            className="block text-sm font-medium text-muted-foreground"
          >
            Account
          </label>
          <div className="mt-1">
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <SelectTrigger className="w-full" id="account">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {`${account.name} ($${parseFloat(
                          account.balance.toString()
                        ).toFixed(2)})`}
                      </SelectItem>
                    ))}
                    <CreateAccountDrawer>
                      <Button
                        variant={"secondary"}
                        className="w-full select-none items-center"
                      >
                        Create Account
                      </Button>
                    </CreateAccountDrawer>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.accountId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.accountId.message}
            </p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-muted-foreground"
        >
          Category
        </label>
        <div className="mt-1">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
              >
                <SelectTrigger className="w-full" id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value={""}>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Date Picker */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-muted-foreground"
        >
          Date
        </label>
        <div className="mt-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full pl-3 text-left font-normal"
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <Calendar1Icon className="h-4 w-4 ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-muted-foreground"
        >
          Description
        </label>
        <div className="mt-1">
          <Input
            {...register("description")}
            id="description"
            placeholder="Enter description"
            className="w-full"
          />
        </div>
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Recurring Transaction */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex flex-col">
          <label
            htmlFor="isRecurring"
            className="text-md font-bold text-muted-foreground"
          >
            Recurring Transaction
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            Set up a recurring schedule for this transaction
          </p>
        </div>
        <Controller
          name="isRecurring"
          control={control}
          render={({ field }) => (
            <Switch
              id="isRecurring"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Conditionally Render Recurring Interval */}
      {isRecurring && (
        <div>
          <label
            htmlFor="recurringInterval"
            className="block text-sm font-medium text-muted-foreground"
          >
            Recurring Interval
          </label>
          <div className="mt-1">
            <Controller
              name="recurringInterval"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <SelectTrigger className="w-full" id="recurringInterval">
                    <SelectValue placeholder="Select Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RecurringInterval.DAILY}>
                      Daily
                    </SelectItem>
                    <SelectItem value={RecurringInterval.WEEKLY}>
                      Weekly
                    </SelectItem>
                    <SelectItem value={RecurringInterval.MONTHLY}>
                      Monthly
                    </SelectItem>
                    <SelectItem value={RecurringInterval.YEARLY}>
                      Yearly
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      )}

      {/* Cancel and Create Transaction Buttons */}
      <div className="flex w-full space-x-4">
        <Button
          variant="outline"
          className="px-6 flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          variant={"default"}
          type="submit"
          className="px-6 flex-1"
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Transaction...
            </>
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}

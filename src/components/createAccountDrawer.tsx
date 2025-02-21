"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useState, startTransition } from "react";
import { accountSchema } from "@/app/lib/schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount } from "@/actions/account";
import useFetch from "@/app/hooks/useFetch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AccountType } from "@prisma/client";

type AccountFormType = z.infer<typeof accountSchema>;

export default function CreateAccountDrawer({
  children,
  onAccountCreated,
}: {
  children: React.ReactNode;
  onAccountCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm<AccountFormType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: AccountType.CURRENT,
      balance: "",
      isDefault: false,
    },
  });

  const {
    data: newAccount,
    error,
    fetchData: createAccountFn,
    loading: createAccountLoading,
  } = useFetch<any, [AccountFormType]>(createAccount);

  const onSubmit = async (values: AccountFormType) => {
    const result = await createAccountFn(values);
    if (!result) {
      // Error is already handled by useFetch (like showing a toast)
      return;
    }

    // ✅ Handle success directly here
    toast.success("Account created successfully");
    startTransition(() => {
      setOpen(false);
      reset();
      onAccountCreated?.();
    });
  };

  return (
    <div className="w-full">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="max-w-3xl mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold">
              Create New Account
            </DrawerTitle>
            <DrawerDescription className="text-gray-400">
              Fill in the account details below to create a new account.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter account name"
                  {...register("name")}
                  className="mt-1 w-full"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium">
                  Account Type
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full mt-1" id="type">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AccountType.CURRENT}>
                          Current
                        </SelectItem>
                        <SelectItem value={AccountType.SAVING}>
                          Savings
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="balance" className="block text-sm font-medium">
                  Initial Balance
                </label>
                <Input
                  {...register("balance")}
                  type="number"
                  id="balance"
                  step="0.01"
                  placeholder="0.00"
                  className="mt-1 w-full"
                />
                {errors.balance && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.balance.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex flex-col">
                  <label htmlFor="isDefault" className="text-md font-bold">
                    Default Account
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    This account will be selected by default for transactions.
                  </p>
                </div>
                <Controller
                  name="isDefault"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isDefault"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <DrawerClose asChild>
                  <Button variant="outline" className="px-6">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  className="px-6"
                  disabled={createAccountLoading}
                >
                  {createAccountLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

import React from "react";
import AddTransactionForm from "../_components/addTransactionForm";
import { GetUserAccount } from "@/actions/account";
import { defaultCategories } from "@/data/categories";

const AddTransactionPage = async () => {
  const accounts = await GetUserAccount();
  return (
    <div className="max-w-3xl w-full px-4 mx-auto ">
      <h1 className="text-primary text-5xl font-extrabold mb-10">Add Transaction</h1>
      <AddTransactionForm
        accounts={accounts.data}
        category={defaultCategories}
      />
    </div>
  );
};

export default AddTransactionPage;

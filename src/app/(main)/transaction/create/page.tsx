import React from "react";
import AddTransactionForm from "../_components/addTransactionForm";
import { GetUserAccount } from "@/actions/account";
import { defaultCategories } from "@/data/categories";
import { getTransaction } from "@/actions/transaction";

export const dynamic = "force-dynamic"; // Add this line

interface SearchParams {
  edit?: string;
}

const AddTransactionPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const accounts = await GetUserAccount();

  const editId = searchParams?.edit || null;
  console.log(`edit id: ${editId}`);

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl w-full px-4 mx-auto ">
      <h1 className="text-primary text-5xl font-extrabold mb-10">
        {editId ? "Edit" : "Add"} Transaction
      </h1>
      <AddTransactionForm
        accounts={accounts.data}
        category={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
};
export default AddTransactionPage;

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Transaction } from "@prisma/client";
import {  format } from "date-fns";
import { categoryColors } from "@/data/categories";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/app/hooks/useFetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

// tracking recurring interval
const RecurringIntervals = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

interface TransactionTableProps {
  transaction: Transaction[]; // because we're passing multiple transactions (an array).
}

export default function TransactionTable({
  transaction,
}: TransactionTableProps) {
  const router = useRouter();

  // state for select transaction
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // state for sort transaction based on fields
  const [sortConfig, setSortConfig] = useState({
    field: "date", // by default sort basis on date
    direction: "desc", // by default sort in descending order
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const {
    loading: deleteLoading,
    fetchData: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  //* Filtered and sorted transaction accourding condition
  const filteredAndSortedTransaction = useMemo(() => {
    let result = [...transaction];

    // apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((transaction) => {
        transaction.description?.toLowerCase().includes(search);
      });
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply income or expense type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = Number(a.amount) - Number(b.amount);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      // Apply sorting direction
      return sortConfig.direction === "asc" ? comparison : -comparison;
      // .sort() needs a function that returns -1, 0, or 1 to determine order.
    });

    // returning the result
    return result;
  }, [transaction, searchTerm, typeFilter, recurringFilter, sortConfig]);

  //* sort transaction according to fields
  const handleSort = (field: string) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  //* select individual transactions
  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    console.log(id);
  };

  //* select all transaction
  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransaction.length
        ? []
        : filteredAndSortedTransaction.map((t) => t.id)
    );
  };

  //* clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  // * handle bulk delete function
  const handleBulkDelete = () => {
    if (
      !window.confirm(
        `Are you sure you wnat to delete ${selectedIds.length} transactions?`
      )
    ) {
      return;
    }

    deleteFn(selectedIds);
  };

  // * show toast if transaction delete
  useEffect(() => {
    if (deleted && !deleteLoading) {
      // Clear the selectedIds state
      setSelectedIds([]);
      setTimeout(() => {
        toast.error("Transactions deleted succesfully");
      }, 0);
    }
  }, [deleted, deleteLoading]);

  return (
    <div className="space-y-4">
      {/* if loading is true then show the barloader */}
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="green" />
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          {/* Search Icon Positioned Properly */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          {/* Input Field */}
          <Input
            className="pl-10 pr-4 "
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          {/* type filter */}
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Filter */}
          <div>
            <Select value={recurringFilter} onValueChange={setRecurringFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Transactions " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">
                  Non-recurring Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* show delete button if any transaction selected */}
          {selectedIds.length > 0 && (
            <div>
              <Button variant={"destructive"} onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {/* clear selection button */}
          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant={"outline"}
              size="icon"
              onClick={handleClearFilters}
              title="Clear Filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox className="rounded-[4px]" onClick={handleSelectAll} />
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center justify-center gap-2">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center justify-center gap-2">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-center"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-center gap-2">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-center">Recurring</TableHead>
              <TableHead className="w-[50px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransaction.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No Transaction Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransaction.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      className="rounded-[4px]"
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() =>
                        handleCheckboxChange(transaction.id)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="capitalize text-center">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-center font-bold ${
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.type === "EXPENSE" ? "- " : "+ "}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {transaction.recurringInterval &&
                                RecurringIntervals[
                                  transaction.recurringInterval
                                ]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {transaction.nextRecurringDate &&
                                  format(
                                    new Date(transaction.nextRecurringDate),
                                    "PP"
                                  )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            );
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

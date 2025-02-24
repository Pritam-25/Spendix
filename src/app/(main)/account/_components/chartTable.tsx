"use client";

import { Transaction } from "@prisma/client";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionTableProps {
  transactions: Transaction[];
}

interface DateRange {
  label: string;
  days: number | null;
}

interface DateRanges {
  [key: string]: DateRange;
}

const DATE_RANGES: DateRanges = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

interface Group {
  date: Date;
  income: number;
  expense: number;
}

interface GroupOfTransactions {
  [key: string]: Group;
}

export default function ChartTable({ transactions }: TransactionTableProps) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = Date.now();
    const startDay = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // Filtering transactions based on selected date range
    const filterTransaction = transactions.filter(
      (t) => new Date(t.date) >= startDay && new Date(t.date) <= endOfDay(now)
    );

    // Grouping transactions by date
    const grouped = filterTransaction.reduce(
      (acc: GroupOfTransactions, transaction) => {
        const date = format(new Date(transaction.date), "MMM dd");

        if (!acc[date]) {
          acc[date] = {
            date: new Date(transaction.date),
            income: 0,
            expense: 0,
          };
        }

        if (transaction.type === "EXPENSE") {
          acc[date].expense += Number(transaction.amount);
        } else {
          acc[date].income += Number(transaction.amount);
        }

        return acc;
      },
      {}
    );

    // Sorting transactions by date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="font-bold text-lg text-green-500">
              $ {totals.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expense</p>
            <p className="font-bold text-lg text-red-500">
              $ {totals.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`font-bold text-lg ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              $ {(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="0" stroke="rgba(128, 128, 128, 0.4)" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return `$ ${value.toFixed(2)}`;
                  }
                  return value;
                }}
                labelFormatter={(label) => {
                  return format(new Date(label), "MMM dd");
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

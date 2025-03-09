import * as React from "react";

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  byCategory?: { [key: string]: number };
}

interface Data {
  month?: string;
  stats?: Stats;
  insights?: string[];
  percentageUsed?: number;
  budgetAmount?: number;
  totalExpenses?: number;
  accountName?: string;
}

export interface EmailTemplateProps {
  userName: string;
  type: "monthly-report" | "budget-alert";
  data: Data;
}

const EmailTemplate = ({
  userName = "",
  type = "monthly-report",
  data = {} as Data,
}: EmailTemplateProps): React.ReactElement => {
  const primaryGreen = "hsl(156.6, 97.6%, 24.3%)";
  const yellowColor = "#FFD700";
  const darkYellowBackground = "rgba(255, 193, 7, 0.1)"; // Slightly dark yellow background

  if (type === "budget-alert") {
    const remainingAmount =
      (data?.budgetAmount ?? 0) - (data?.totalExpenses ?? 0);
    const isWarning = (data?.percentageUsed ?? 0) > 80;
    const progressWidth = Math.min(data?.percentageUsed ?? 0, 100);
    const progressColor = isWarning ? "#ef4444" : "#10b981";

    return (
      <Html>
        <Head>
          <style>
            {`
              @media (min-width: 640px) {
                .container { max-width: 600px !important; }
                .percentage { font-size: 3.5rem !important; }
                .card-amount { font-size: 1.75rem !important; }
              }
            `}
          </style>
        </Head>
        <Preview>Spendix Budget Alert</Preview>
        <Tailwind>
          <Body className="bg-black font-sans">
            <Container className="mx-auto w-full max-w-[440px] p-0">
              {/* Header Section */}
              <Section className="px-4 py-6 text-center">
                <h1 className="text-primary font-bold text-4xl">SPENDIX</h1>
                <Text className="text-sm font-medium uppercase tracking-wider text-emerald-400">
                  BUDGET ALERT
                </Text>
                <Text className="text-base text-gray-300 mt-4">
                  Hello {userName}, we have an update on your monthly budget for{" "}
                  {data.accountName}.
                </Text>
              </Section>

              {/* Budget Status Section */}
              <Section className="px-4 text-center">
                <Text className="percentage text-6xl font-bold text-white mb-1">
                  {(data?.percentageUsed ?? 0).toFixed(1)}%
                </Text>
                <Text className="text-emerald-400 text-base mb-4">
                  of your budget used
                </Text>

                {/* Progress Bar - Email Compatible Version */}
                <table
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  style={{ width: "100%" }}
                >
                  <tr>
                    <td>
                      <table
                        cellPadding={0}
                        cellSpacing={0}
                        border={0}
                        style={{
                          width: "100%",
                          backgroundColor: "#1f2937",
                          borderRadius: "9999px",
                          height: "8px",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              width: `${progressWidth}%`,
                              backgroundColor: progressColor,
                              height: "8px",
                              borderRadius: "9999px",
                            }}
                          ></td>
                          <td
                            style={{
                              width: `${100 - progressWidth}%`,
                            }}
                          ></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <Text className="text-gray-400 text-sm mt-4">
                  {remainingAmount >= 0
                    ? `You have $${remainingAmount.toLocaleString()} remaining`
                    : `You've exceeded your budget by $${Math.abs(
                        remainingAmount
                      ).toLocaleString()}`}
                </Text>
              </Section>

              {/* Budget Details */}
              <Section className="mt-6 px-4">
                {/* Budget Card */}
                <div className="w-full bg-[#002B1B] rounded-lg p-4 mb-3">
                  <Text className="text-gray-400 text-sm mb-1">Budget</Text>
                  <Text className="card-amount text-2xl font-bold text-emerald-400">
                    ${(data?.budgetAmount ?? 0).toLocaleString()}
                  </Text>
                </div>

                {/* Spent Card */}
                <div className="w-full bg-[#2B0718] rounded-lg p-4">
                  <Text className="text-gray-400 text-sm mb-1">Spent</Text>
                  <Text className="card-amount text-2xl font-bold text-rose-400">
                    ${(data?.totalExpenses ?? 0).toLocaleString()}
                  </Text>
                </div>
              </Section>

              {/* Recommendations Section */}
              <Section className="mt-6 px-4 pb-8">
                <Text className="text-base text-gray-300 leading-relaxed">
                  {isWarning
                    ? "Consider reviewing your spending in the highest expense categories to stay within your budget for the rest of the month."
                    : "You're managing your budget well. Keep up the good work and continue monitoring your expenses."}
                </Text>
              </Section>

              {/* Footer */}
              <Section className="border-t border-gray-800 mt-4 px-4 py-6 text-center">
                <Link
                  href="http://localhost:3000/dashboard"
                  className="inline-block px-6 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold no-underline"
                >
                  View Details
                </Link>
                <Text className="text-xs text-gray-500 mt-6">
                  © 2024 Spendix. All rights reserved.
                </Text>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }

  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Spendix Monthly Report</Preview>
        <Tailwind>
          <Body className="bg-black font-sans">
            <Container className="w-full p-0">
              {/* Header Section */}
              <Section className="p-8 text-center bg-gray-900">
              <h1 className="text-primary font-bold text-3xl">SPENDIX</h1>
                <Text className="text-sm font-normal uppercase tracking-wider text-gray-400">
                  {data?.month} Financial Report
                </Text>
                <Heading className="my-4 text-4xl font-medium leading-tight text-white">
                  Your Monthly Finance Insights
                </Heading>
                <Text className="mb-8 text-lg leading-8 text-gray-300">
                  Hello {userName}, here's your personalized financial summary
                  for the month.
                </Text>
              </Section>

              {/* Main Stats Section with gradient */}
              <Section className="my-6 rounded-2xl bg-[#16A34A]/10 bg-[radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.4)_0%,transparent_60%)] p-8 text-center">
                <Heading className="m-0 text-3xl font-medium text-[#16A34A]">
                  Your Balance
                </Heading>
                <Text className="my-4 text-7xl font-bold leading-none text-white">
                  $
                  {(
                    (data?.stats?.totalIncome ?? 0) -
                    (data?.stats?.totalExpenses ?? 0)
                  ).toLocaleString()}
                </Text>
                <Text className="mb-4 text-xl font-medium text-gray-300">
                  This month's net balance
                </Text>

                <Hr className="mt-6" style={{ borderColor: primaryGreen }} />
                <Heading className="pt-5 text-xs font-medium uppercase tracking-wider text-gray-300">
                  Monthly Activity
                </Heading>

                <Row className="mt-5">
                  <Column className="w-1/2 text-center">
                    <Text className="text-sm font-medium text-[#16A34A]">
                      Income
                    </Text>
                    <Text className="my-1 text-4xl font-bold text-white">
                      ${(data?.stats?.totalIncome ?? 0).toLocaleString()}
                    </Text>
                  </Column>
                  <Column className="w-1/2 text-center">
                    <Text className="text-sm font-medium text-[#16A34A]">
                      Expenses
                    </Text>
                    <Text className="my-1 text-4xl font-bold text-white">
                      ${(data?.stats?.totalExpenses ?? 0).toLocaleString()}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Remaining Amount Section */}
              <Section
                className="my-6 rounded-2xl p-8 text-center"
                style={{ backgroundColor: darkYellowBackground }}
              >
                <Heading
                  className="m-0 text-3xl font-medium"
                  style={{ color: yellowColor }}
                >
                  Remaining Amount
                </Heading>
                <Text className="my-4 text-7xl font-bold leading-none text-white">
                  $
                  {(
                    (data?.budgetAmount ?? 0) - (data?.totalExpenses ?? 0)
                  ).toLocaleString()}
                </Text>
                <Text className="mb-4 text-xl font-medium text-gray-300">
                  This month's remaining budget
                </Text>
              </Section>

              {/* Category Breakdown */}
              {data?.stats?.byCategory && (
                <Section className="my-6 rounded-2xl bg-gray-900/50 p-8">
                  <Heading className="m-0 text-2xl font-medium text-[#16A34A] text-center">
                    Expense Breakdown
                  </Heading>

                  <div className="mt-6">
                    {Object.entries(data.stats.byCategory).map(
                      ([category, amount], index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 border-b border-gray-800"
                        >
                          <Text className="text-white text-base m-0">
                            {category}
                          </Text>
                          <Text className="text-gray-300 font-medium text-base m-0">
                            ${amount.toLocaleString()}
                          </Text>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
                    <Text className="text-[#16A34A] font-medium text-base m-0">
                      Total Expenses
                    </Text>
                    <Text className="text-white font-bold text-base m-0">
                      ${(data?.stats?.totalExpenses ?? 0).toLocaleString()}
                    </Text>
                  </div>
                </Section>
              )}

              {/* AI Insights Section */}
              {data?.insights && (
                <Section className="my-6 rounded-2xl bg-[#16A34A]/5 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.2)_0%,transparent_60%)] p-8">
                  <Heading className="m-0 text-2xl font-medium text-[#16A34A] text-center">
                    Financial Insights
                  </Heading>

                  <div className="mt-4 space-y-4">
                    {data.insights.map((insight, index) => (
                      <div
                        key={index}
                        className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm"
                      >
                        <Text className="text-gray-300 text-sm leading-relaxed m-0">
                          {insight}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Financial Health Section */}
              <Section className="my-6 rounded-2xl bg-gray-900/50 p-8 text-center">
                <Heading className="m-0 text-xl font-medium text-[#16A34A]">
                  Your Financial Health
                </Heading>

                <div className="flex items-center justify-center mt-4">
                  <div className="w-full max-w-[300px] bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#16A34A] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          ((data?.stats?.totalIncome ?? 0) /
                            ((data?.stats?.totalExpenses ?? 0) || 1)) *
                            50,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <Text className="mt-4 text-sm text-gray-400">
                  Keep your income higher than expenses for optimal financial
                  health
                </Text>
              </Section>

              {/* Footer */}
              <Section className="pb-6 text-center bg-gray-900">
                <Text className="text-gray-300 text-lg leading-8">
                  Track your finances anytime, anywhere with Spendix
                </Text>
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center rounded-full bg-[#16A34A] px-12 py-4 text-center text-sm font-bold text-black no-underline"
                >
                  Open Spendix App
                </Link>
                <Link
                  href="#"
                  className="mt-4 block items-center text-center text-sm font-bold text-[#16A34A] no-underline"
                >
                  View Detailed Report
                </Link>
                <Text className="mt-8 text-xs text-gray-500">
                  © 2025 Spendix. All rights reserved.
                </Text>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }

  // Default fallback template
  return (
    <Html>
      <Head />
      <Preview>Spendix Notification</Preview>
      <Tailwind>
        <Body className="bg-black font-sans">
          <Container className="w-full p-8">
            <Text className="text-center text-white">
              Hello {userName}, you have a new notification from Spendix.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default EmailTemplate
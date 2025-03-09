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
  accountName: string
}

export interface EmailTemplateProps {
  userName: string;
  type: string;
  data: Data;
}

export const EmailTemplate = ({
  userName = "",
  type = "monthly-report",
  data = {} as Data,
}) => {
  // Modern green color as specified (HSL: 156.6, 97.6%, 24.3%)
  const primaryGreen = "hsl(156.6, 97.6%, 24.3%)";
  const primaryGreenRGB = "22, 163, 74";
  const primaryGreenLight = "hsl(156.6, 97.6%, 35%)";
  const primaryGreenDark = "hsl(156.6, 97.6%, 15%)";

  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Spendix Monthly Report</Preview>
        <Tailwind>
          <Body className="bg-black font-sans">
            <Container className="mx-auto w-full max-w-[600px] p-0">
              {/* Header Section */}
              <Section className="p-8 text-center">
                <Text className="mx-0 mb-2 mt-4 p-0 text-center text-2xl font-normal">
                  <span className="font-bold tracking-tighter text-[#16A34A]">
                    SPENDIX
                  </span>
                </Text>
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
              <Section className="pb-6 text-center">
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

  if (type === "budget-alert") {
    const remainingAmount =
      (data?.budgetAmount ?? 0) - (data?.totalExpenses ?? 0);
    const isWarning = (data?.percentageUsed ?? 0) > 80;
    const alertColor = isWarning ? "#EF4444" : primaryGreen;

    return (
      <Html>
        <Head />
        <Preview>Spendix Budget Alert</Preview>
        <Tailwind>
          <Body className="bg-black font-sans">
            <Container className="mx-auto w-full max-w-[600px] p-0">
              {/* Header Section */}
              <Section className="p-8 text-center">
                <Text className="mx-0 mb-2 mt-4 p-0 text-center text-2xl font-normal">
                  <span className="font-bold tracking-tighter text-[#16A34A]">
                    SPENDIX
                  </span>
                </Text>
                <Text className="text-sm font-normal uppercase tracking-wider text-gray-400">
                  Budget Alert
                </Text>
                <Heading
                  className="my-4 text-4xl font-medium leading-tight"
                  style={{ color: alertColor }}
                >
                  Budget Update
                </Heading>
                <Text className="mb-8 text-lg leading-8 text-gray-300">
                  Hello {userName}, we have an update on your monthly budget.
                </Text>
              </Section>

              {/* Budget Alert Section */}
              <Section
                className="my-6 rounded-2xl p-8 text-center"
                style={{
                  backgroundColor: `rgba(${
                    isWarning ? "239, 68, 68" : "22, 163, 74"
                  }, 0.1)`,
                  backgroundImage: `radial-gradient(circle at bottom right, rgba(${
                    isWarning ? "239, 68, 68" : "22, 163, 74"
                  }, 0.4) 0%, transparent 60%)`,
                }}
              >
                <Heading
                  className="m-0 text-3xl font-medium"
                  style={{ color: alertColor }}
                >
                  Budget Status
                </Heading>
                <Text className="my-4 text-7xl font-bold leading-none text-white">
                  {(data?.percentageUsed ?? 0).toFixed(1)}%
                </Text>
                <Text className="mb-4 text-xl font-medium text-gray-300">
                  of your budget used
                </Text>

                <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden mt-6">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(data?.percentageUsed ?? 0, 100)}%`,
                      backgroundColor: alertColor,
                    }}
                  ></div>
                </div>

                <Text className="mt-4 text-sm text-gray-300">
                  {remainingAmount >= 0
                    ? `You have $${remainingAmount.toLocaleString()} remaining in your budget`
                    : `You've exceeded your budget by $${Math.abs(
                        remainingAmount
                      ).toLocaleString()}`}
                </Text>
              </Section>

              {/* Budget Details */}
              <Section className="my-6 rounded-2xl bg-gray-900/50 p-8">
                <Row>
                  <Column className="w-1/3 text-center">
                    <Text className="text-sm font-medium text-[#16A34A] m-0">
                      Budget
                    </Text>
                    <Text className="my-1 text-2xl font-bold text-white m-0">
                      ${(data?.budgetAmount ?? 0).toLocaleString()}
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-center">
                    <Text className="text-sm font-medium text-[#16A34A] m-0">
                      Spent
                    </Text>
                    <Text className="my-1 text-2xl font-bold text-white m-0">
                      ${(data?.totalExpenses ?? 0).toLocaleString()}
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-center">
                    <Text className="text-sm font-medium text-[#16A34A] m-0">
                      Remaining
                    </Text>
                    <Text
                      className="my-1 text-2xl font-bold m-0"
                      style={{
                        color: remainingAmount >= 0 ? "white" : "#EF4444",
                      }}
                    >
                      ${remainingAmount.toLocaleString()}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Recommendations */}
              <Section className="my-6 rounded-2xl bg-gray-900/50 p-8">
                <Heading className="m-0 text-xl font-medium text-[#16A34A] text-center">
                  {isWarning ? "Budget Recommendations" : "You're on track!"}
                </Heading>

                <Text className="mt-4 text-base text-gray-300 leading-relaxed">
                  {isWarning
                    ? "Consider reviewing your spending in the highest expense categories to stay within your budget for the rest of the month."
                    : "You're managing your budget well. Keep up the good work and continue monitoring your expenses."}
                </Text>
              </Section>

              {/* Footer */}
              <Section className="pb-6 text-center">
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center rounded-full bg-[#16A34A] px-12 py-4 text-center text-sm font-bold text-black no-underline"
                >
                  Check Spending Details
                </Link>
                <Link
                  href="#"
                  className="mt-4 block items-center text-center text-sm font-bold text-[#16A34A] no-underline"
                >
                  Adjust Budget Settings
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
};

// SpendixEmailTemplate.PreviewProps = {
//   userName: "Alex",
//   type: "monthly-report",
//   data: {
//     month: "March",
//     stats: {
//       totalIncome: 5250,
//       totalExpenses: 3420,
//       byCategory: {
//         Housing: 1500,
//         Food: 650,
//         Transportation: 450,
//         Entertainment: 320,
//         Utilities: 280,
//         Other: 220,
//       },
//     },
//     insights: [
//       "Your food expenses have decreased by 12% compared to last month.",
//       "You've saved $320 more this month than your monthly average.",
//       "Consider setting aside some of your extra savings for your emergency fund.",
//     ],
//   },
// } as const;

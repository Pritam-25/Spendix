"use client"
import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { LineChart, PieChart, BarChart2, TrendingUp } from "lucide-react";
import MiniChart from "./ui/mini-chart";

const AnalyticsSection = (): ReactElement => {
  // Define a softer color palette
  const colors = {
    primary: "rgb(var(--primary))",
    indigo: "#818CF8",    // Soft indigo
    sky: "#7DD3FC",       // Soft sky blue
    rose: "#FDA4AF",      // Soft rose
    amber: "#FCD34D",     // Soft amber
    emerald: "#6EE7B7"    // Soft emerald
  };

  return (
    <div className="w-full py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(129,140,248,0.03),transparent_50%)]" />
      {/* <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M10 10h80v80H10z' stroke='rgba(129,140,248,0.05)' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '50px 50px'
      }} /> */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">Smart Analytics</h2>
            <p className="text-muted-foreground text-lg">Track your spending patterns with AI-powered insights</p>
          </motion.div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Monthly Spending Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-indigo-400/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Monthly Spending</h3>
                    <p className="text-sm text-muted-foreground">Last 30 days activity</p>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-400/10">
                    <LineChart className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="h-[150px]">
                  <MiniChart colors={colors} />
                </div>
              </div>
            </motion.div>

            {/* Budget Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-sky-400/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Budget Overview</h3>
                    <p className="text-sm text-muted-foreground">Monthly budget tracking</p>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-400/10">
                    <PieChart className="w-5 h-5 text-sky-400" />
                  </div>
                </div>

                {[
                  { category: "Shopping", spent: 450, total: 600, color: colors.indigo },
                  { category: "Bills", spent: 850, total: 1000, color: colors.sky },
                  { category: "Entertainment", spent: 200, total: 300, color: colors.rose }
                ].map((item, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.category}</span>
                      <span className="text-muted-foreground">${item.spent} / ${item.total}</span>
                    </div>
                    <div className="h-2 bg-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.spent / item.total) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Savings Goals Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-rose-400/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Savings Goals</h3>
                    <p className="text-sm text-muted-foreground">Progress tracking</p>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-400/10">
                    <TrendingUp className="w-5 h-5 text-rose-400" />
                  </div>
                </div>

                {[
                  { goal: "Emergency Fund", current: 8000, target: 10000, color: colors.amber },
                  { goal: "Vacation", current: 2500, target: 5000, color: colors.emerald },
                  { goal: "New Car", current: 15000, target: 30000, color: colors.rose }
                ].map((item, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.goal}</span>
                      <span className="text-muted-foreground">${item.current} / ${item.target}</span>
                    </div>
                    <div className="h-2 bg-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.current / item.target) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Total Savings",
                value: "$12,580",
                change: "+8.2%",
                icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
                bgColor: "bg-indigo-400/10",
                borderColor: "hover:border-indigo-400/20",
                gradient: "from-indigo-400/5",
              },
              {
                title: "Monthly Spend",
                value: "$2,420",
                change: "-4.3%",
                icon: <BarChart2 className="w-6 h-6 text-sky-400" />,
                bgColor: "bg-sky-400/10",
                borderColor: "hover:border-sky-400/20",
                gradient: "from-sky-400/5",
              },
              {
                title: "Budget Status",
                value: "On Track",
                change: "92%",
                icon: <PieChart className="w-6 h-6 text-rose-400" />,
                bgColor: "bg-rose-400/10",
                borderColor: "hover:border-rose-400/20",
                gradient: "from-rose-400/5",
              },
              {
                title: "Active Goals",
                value: "4/5",
                change: "+1",
                icon: <LineChart className="w-6 h-6 text-amber-400" />,
                bgColor: "bg-amber-400/10",
                borderColor: "hover:border-amber-400/20",
                gradient: "from-amber-400/5",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 ${stat.borderColor}`}
              >
                {/* Hover Gradient Effect */}
                <div
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient} to-transparent`}
                />

                <div className="relative flex items-center gap-4 z-10">
                  {/* Icon with Dynamic Background */}
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    {stat.icon}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stat.value}</span>
                      <span
                        className={`text-xs ${stat.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                          }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection; 
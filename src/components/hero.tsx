"use client"
import React from "react";
import { Button } from "./ui/button";
import { Bell, Sparkles, TrendingUp, Brain, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import AnalyticsSection from "./analytics-section";
import Footer from "./footer";

const HeroSection = () => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-[60px]">
        {/* Enhanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00FF88] opacity-[0.10] blur-[80px] rounded-full" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 bg-grid-pattern opacity-[0.12]"
            style={{
              maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 60%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 60%)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v40H0z' fill='%2300FF88' fill-opacity='0.15'/%3E%3Cpath d='M39 0h1v40h-1z' fill='%2300FF88' fill-opacity='0.15'/%3E%3Cpath d='M0 0h40v1H0z' fill='%2300FF88' fill-opacity='0.15'/%3E%3Cpath d='M0 39h40v1H0z' fill='%2300FF88' fill-opacity='0.15'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <div className="bg-white/10 px-4 py-2 rounded-full border flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">AI-Powered Financial Management</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-extrabold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
              >
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-t from-green-700 to-green-500 dark:from-green-500 dark:to-green-300">
                  Track Your Finances
                </span>
                <br />
                <span className="inline-block">
                  with AI-Powered Insights
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto"
              >
                Smart budget tracking, real-time analytics, and automated alerts when you reach your limit.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex gap-4 justify-center items-center mt-8"
              >
                {/* Primary CTA Button */}
                <Button
                  className="relative group h-12 px-8 min-w-[160px] rounded-xl bg-primary/40 hover:bg-primary-foreground text-white transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2 text-base font-semibold">
                    Get Started
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 rounded-xl  group-hover:opacity-100 transition-opacity duration-300" />
                </Button>

                {/* Secondary CTA Button */}
                <Button
                  variant="outline"
                  className="h-12 px-8 min-w-[160px] rounded-xl border-2 border-primary/20 hover:border-primary/40 bg-transparent hover:bg-primary/5 text-base font-semibold backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>

            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  icon: <Brain className="w-6 h-6 text-indigo-400" />,
                  title: "AI-Powered Analytics",
                  description: "Get personalized insights and recommendations powered by advanced AI algorithms",
                  bgColor: "bg-indigo-400/10",
                  borderColor: "hover:border-indigo-400/20",
                  gradient: "from-indigo-400/5"
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-rose-400" />,
                  title: "Smart Tracking",
                  description: "Monitor your spending patterns and savings goals with real-time updates",
                  bgColor: "bg-rose-400/10",
                  borderColor: "hover:border-rose-400/20",
                  gradient: "from-rose-400/5"
                },
                {
                  icon: <Bell className="w-6 h-6 text-amber-400" />,
                  title: "Intelligent Alerts",
                  description: "Receive smart notifications about your financial health and opportunities",
                  bgColor: "bg-primary/5",
                  borderColor: "hover:border-amber-400/20",
                  gradient: "from-amber-400/5"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  className={`group relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 ${feature.borderColor} transition-all duration-300`}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                    whileHover={{ scale: 1.02 }}
                  />
                  <div className="relative z-10">
                    <motion.div className={`mb-6 p-3 w-fit rounded-xl ${feature.bgColor}`} whileHover={{ scale: 1.1 }}>
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>


          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsSection />
      <Footer />
    </>
  );
};

export default HeroSection;

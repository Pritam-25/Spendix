"use client"
import { motion } from "framer-motion";

interface MiniChartProps {
  colors?: {
    primary: string;
    indigo: string;
    sky: string;
    rose: string;
    amber: string;
    emerald: string;
  };
}

const MiniChart = ({ colors }: MiniChartProps) => {
  // Sample data points for the chart
  const points = [4, 6, 3, 8, 5, 7, 4, 6, 8, 5, 7, 9];
  const maxValue = Math.max(...points);
  
  // Define gradient colors
  const gradientColors = [
    colors?.indigo || "rgb(var(--primary))",
    colors?.sky || "rgb(var(--primary))",
    colors?.rose || "rgb(var(--primary))",
    colors?.amber || "rgb(var(--primary))"
  ];
  
  return (
    <div className="w-full h-20 flex items-end gap-1">
      {points.map((point, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(point / maxValue) * 100}%` }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          style={{
            background: `linear-gradient(to top, ${gradientColors[index % gradientColors.length]}50, ${gradientColors[index % gradientColors.length]})`
          }}
          className="flex-1 rounded-t-sm"
        />
      ))}
    </div>
  );
};

export default MiniChart; 
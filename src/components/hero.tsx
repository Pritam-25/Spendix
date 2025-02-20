import React from "react";

const HeroSection = () => {
  return (
    <div className="w-11/12 min-h-screen  p-10  mx-auto rounded-lg flex item-center justify-center">
      <div>
        <h1
          id="manage-your-finance-with-intelligence"
          className="font-extrabold text-4xl text-green-600 text-center"
        >
          Manage Your Finance <br /> with Intelligence
        </h1>
        <p className="font-normal text-2xl mt-6 text-center">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;

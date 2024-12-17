import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import formatNumber from "../../../../utils/index";

function CardInfo({ budgetList,  income }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, income]);

  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      const advice = getFinancialAdvice(totalBudget, totalIncome, totalSpend);
      setFinancialAdvice(advice);
    }
  }, [totalBudget, totalIncome, totalSpend]);

  const CalculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpend_ = totalSpend_ + element.totalSpend;
    });

    setTotalIncome(income);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  const getFinancialAdvice = (budget, income, expense) => {
    const savingsRate = (income - expense) / income;
    const budgetUtilization = expense / budget;

    if (expense > income) {
      return "Your expenses exceed your income. It's crucial to cut down on spending and find ways to increase your income.";
    } else if (budgetUtilization > 1) {
      return "You're overspending your budget. Try to identify areas where you can reduce expenses to stay within your budget.";
    } else if (savingsRate < 0.1) {
      return "Your savings rate is low. Aim to save at least 10% of your income. Look for ways to reduce non-essential expenses.";
    } else if (savingsRate > 0.2 && budgetUtilization < 0.8) {
      return "Great job! You're saving a good portion of your income and staying within budget. Consider investing your savings for long-term growth.";
    } else if (budgetUtilization < 0.5) {
      return "You're significantly under-budget. While this is good for savings, ensure you're not sacrificing necessities or quality of life.";
    } else {
      return "You're managing your finances well. Keep monitoring your expenses and look for opportunities to increase your income or optimize your budget.";
    }
  };

  // const CalculateCardInfo = () => {
  //   console.log(budgetList);
  //   let totalBudget_ = 0;
  //   let totalSpend_ = 0;
  //   let totalIncome_ = 0;

  //   budgetList.forEach((element) => {
  //     totalBudget_ = totalBudget_ + Number(element.amount);
  //     totalSpend_ = totalSpend_ + element.totalSpend;
  //   });
    
  //   // income.forEach((element) => {
  //   //   totalIncome_ = totalIncome_ + element.totalAmount;
  //   //   console.log(element.totalAmount)
  //   // });

  //   setTotalIncome(income);
  //   setTotalBudget(totalBudget_);
  //   setTotalSpend(totalSpend_);
  // };

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between  bg-blue-900  ">
            <div className="">
              <div className="flex mb-2 flex-row space-x-1 items-center">
              </div>
              <h2 className="font-light text-white">
                {financialAdvice || "Loading financial advice..."}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalBudget)}
                </h2>
              </div>
              <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Spend</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalSpend)}
                </h2>
              </div>
              <ReceiptText className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
              </div>
              <Wallet className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Sum of Income Streams</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalIncome)}
                </h2>
              </div>
              <CircleDollarSign className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;

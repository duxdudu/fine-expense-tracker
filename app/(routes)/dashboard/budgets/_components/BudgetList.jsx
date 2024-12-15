"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";
import { eq, getTableColumns, sql, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { Budgets, expenses } from "../../../../../utils/schema";
import { db } from "../../../../../utils/dbConfig";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);

  const { user } = useUser();
  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(expenses, eq(Budgets.id, expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Budget Report", 14, 15);

    const tableColumn = ["Name", "Amount", "Total Spend", "Total Items"];
    const tableRows = budgetList.map(budget => [
      budget.name,
      budget.amount,
      budget.totalSpend || 0,
      budget.totalItem || 0
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("budget_report.pdf");
  };

  return (
    <div className="mt-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Budget List</h2>
        <button 
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Download PDF
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={() => getBudgetList()} />
        {budgetList?.length > 0
          ? budgetList.map((budget, index) => <BudgetItem key={budget.id} budget={budget} />)
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default BudgetList;
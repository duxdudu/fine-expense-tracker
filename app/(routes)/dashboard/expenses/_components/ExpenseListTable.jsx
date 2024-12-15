import { Trash, Download, ArrowUpDown } from "lucide-react";
import React, { useState } from "react";
import { db } from "../../../../../utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { expenses, Budgets } from "../../../../../utils/schema";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ExpenseListTable({ expensesList, refreshData }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const deleteExpense = async (expense) => {
    const result = await db
      .delete(expenses)
      .where(eq(expenses.id, expense.id))
      .returning();

    if (result) {
      refreshData();
      toast("Expense Deleted");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 15);

    const tableColumn = ["Name", "Amount", "Date"];
    const tableRows = sortedExpenses.map(expense => [
      expense.name,
      expense.amount,
      expense.createdAt
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("expense_report.pdf");
  };

  const sortExpenses = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedExpenses = React.useMemo(() => {
    let sortableExpenses = [...expensesList];
    if (sortConfig.key !== null) {
      sortableExpenses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableExpenses;
  }, [expensesList, sortConfig]);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expense List</h2>
        <button 
          onClick={generatePDF}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-4 bg-slate-200 p-2">
        <h2 className="font-bold flex items-center cursor-pointer" onClick={() => sortExpenses('name')}>
          Name <ArrowUpDown className="h-4 w-4 ml-1" />
        </h2>
        <h2 className="font-bold flex items-center cursor-pointer" onClick={() => sortExpenses('amount')}>
          Amount <ArrowUpDown className="h-4 w-4 ml-1" />
        </h2>
        <h2 className="font-bold flex items-center cursor-pointer" onClick={() => sortExpenses('createdAt')}>
          Date <ArrowUpDown className="h-4 w-4 ml-1" />
        </h2>
        <h2 className="font-bold">Action</h2>
      </div>

      {sortedExpenses.map((expense, index) => (
        <div key={index} className="grid grid-cols-4 bg-slate-100 p-2">
          <h2>{expense.name}</h2>
          <h2>{expense.amount}</h2>
          <h2>{expense.createdAt}</h2>
          <h2>
            <Trash
              className="text-red-600 cursor-pointer"
              onClick={() => deleteExpense(expense)}
            />
          </h2>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
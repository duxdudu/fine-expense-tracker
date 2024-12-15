import React, { useState } from "react";
import moment from "moment";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, expenses } from "../../../../../utils/schema";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import { Button } from "../../../../../components/ui/button";
import * as XLSX from "xlsx";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addNewExpense = async () => {
    const result = await db
      .insert(expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/YYYY"),
      })
      .returning({ insertedId: Budgets.id });

    console.log(result);
    if (result) {
      refreshData();
      toast("New Expense Added");
      setName(""); // Reset name to empty string
      setAmount(""); // Reset amount to empty string
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      for (const expense of jsonData) {
        const result = await db
          .insert(expenses)
          .values({
            name: expense.name,
            amount: expense.amount,
            budgetId: budgetId,
            createdAt: moment().format("DD/MM/YYYY"),
          })
          .returning({ insertedId: Budgets.id });

        if (result) {
          refreshData();
        }
      }
      toast("Expenses from Excel Added");
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          value={name}
          placeholder="e.g. Groceries"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          value={amount}
          type="number"
          placeholder="e.g. 1000"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={() => addNewExpense()}
        className="mt-3 w-full"
      >
        Add New Expense
      </Button>
      <div className="mt-4">
        <h2 className="text-black font-medium my-1">Upload Excel</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default AddExpense;
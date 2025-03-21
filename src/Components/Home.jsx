import { LineChart, PieChart } from "@mui/x-charts";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import "../Home.css";

import ExpenseTable from "./ExpenseTable";

const Home = () => {
  const { id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [MonthCost, setMonthlyCost] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [saveExpenseData, setSaveExpenseData] = useState({});
  const [ExpenseId, setExpenseId] = useState(null);
  // const [editExpense, setEditExpense] = useState({});
  const [editing, setEdting] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    getExpense(id);
  }, [saveExpenseData]);

  useEffect(() => {
    getMonth();
    getExpenseByCategories();
    // console.log(saveExpenseData);
  }, [expenses]);

  //   useEffect(() => {
  //     TotalExpense(); // Calculate total when `expenses` updates
  //   }, [expenses]);
  const formattedData = expenses.map((expense, index) => ({
    id: index,
    value: expense.ExpenseCost,
    label: expense.ExpenseType,
    CreatedAt: new Date(expense.createdAt).toLocaleDateString("en-US"),
    month: new Date(expense.createdAt).toLocaleString("en-US", {
      month: "long",
    }),
  }));

  function getMonth() {
    const expensesByMonth = {};
    expenses.forEach((expense) => {
      const month = new Date(expense.createdAt).toLocaleString("en-US", {
        month: "long",
      });

      if (!expensesByMonth[month]) {
        expensesByMonth[month] = 0; // Initialize if month not present
      }
      expensesByMonth[month] += expense.ExpenseCost; // Add expense cost
    });

    setMonthlyCost(expensesByMonth);
    getExpenseByCategories();
  }
  function getExpenseByCategories() {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.ExpenseType]) {
        categoryTotals[expense.ExpenseType] = 0; // Initialize category if not present
      }
      categoryTotals[expense.ExpenseType] += expense.ExpenseCost; // Sum up expense cost
    });

    // Convert object to array format required by PieChart
    const formattedData = Object.keys(categoryTotals).map(
      (category, index) => ({
        id: index,
        value: categoryTotals[category],
        label: category,
      })
    );

    setCategoryData(formattedData);
  }

  function getExpense(id) {
    axios
      .get(`http://localhost:3000/api/users/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data.AllExpenses);
        setExpenses(response.data.AllExpenses);
      });
  }

  async function addExpense(userId) {
    await axios
      .post(
        `http://localhost:3000/api/add/${userId}`,
        {
          ExpenseCost: saveExpenseData.ExpenseCost,
          ExpenseType: saveExpenseData.ExpenseType,
        },

        { withCredentials: true }
      )
      .then((response) => {
        setSaveExpenseData({});
      });
  }

  function handleSaveChange(id) {
    addExpense(id);
  }

  function EditExpense(ExpenseId) {
    axios
      .patch(
        `http://localhost:3000/api/expenses/${ExpenseId}`,
        {
          ExpenseCost: saveExpenseData.ExpenseCost,
          ExpenseType: saveExpenseData.ExpenseType,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        setEdting(false);
        setSaveExpenseData({});
      });
  }

  function deleteExpense(userId, ExpenseId) {
    axios
      .delete(
        `http://localhost:3000/api/users/${userId}/expenses/${ExpenseId}`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Task deleted successfully:", response.data);

        setExpenses((prevExpense) =>
          prevExpense.filter((exp) => exp._id !== ExpenseId)
        );
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }

  function handleEditData(ExpenseCost, ExpenseType, ExpenseId) {
    console.log(ExpenseId);

    setSaveExpenseData({
      ExpenseCost: ExpenseCost,
      ExpenseType: ExpenseType,
    });
    setExpenseId(ExpenseId);
    setEdting(true);
  }

  function handleDelete(id, ExpenseId) {
    deleteExpense(id, ExpenseId);
  }
  return (
    <div id="Charts">
      <div id="pie-chart">
        {expenses.length > 0 ? (
          <PieChart
            series={[
              {
                data: categoryData,
                innerRadius: 50, // Make it a donut chart
                outerRadius: 100,
                paddingAngle: 3, // Space between segments
                colors: [
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                  "#FFA726",
                  "#66BB6A",
                ],
              },
            ]}
            width={450}
            height={300}
            sx={{
              ".MuiChartsLegend-label": {
                fontSize: "14px",
                fontFamily: "Poppins",
                fontWeight: "400",
              },
              ".MuiChartsTooltip-content": {
                fontSize: "14px",
                fontFamily: "Poppins",
                fontWeight: "400",
              },
            }}
          />
        ) : (
          <p>Loading expenses...</p>
        )}
      </div>
      <div id="line-chart">
        {expenses.length > 0 ? (
          <LineChart
            xAxis={[
              {
                data: Object.keys(MonthCost),
                scaleType: "band",
              },
            ]} // X-Axis: Dates
            series={[
              {
                data: Object.values(MonthCost),
                area: true,
                // Fill area under the curve
                color: theme.palette.primary.main, // Apply MUI primary color
                curveType: "monotone", // Smooth the curve
              },
            ]}
            width={450}
            height={300}
            sx={{
              ".MuiChartsLegend-label": {
                fontSize: "14px",
                fontFamily: "Poppins",
                fontWeight: "400",
              },
              ".MuiChartsTooltip-content": {
                fontSize: "14px",
                fontFamily: "Poppins",
                fontWeight: "400",
              },
            }}
          />
        ) : (
          <p>Loading LineChart...</p>
        )}
      </div>
      <div id="Input-Text">
        <h1>Add Expenses</h1>
        <input
          type="number"
          value={saveExpenseData.ExpenseCost || ""}
          onChange={(e) =>
            setSaveExpenseData((prevData) => ({
              ...prevData, // Preserve existing properties
              ExpenseCost: Number(e.target.value), // Update only ExpenseCost
            }))
          }
        />
        <div id="categories-container">
          <label class="radio-label">
            <input
              type="radio"
              name="category"
              value="Rent"
              onChange={(e) =>
                setSaveExpenseData((prevData) => ({
                  ...prevData,
                  ExpenseType: e.target.value, // Save selected category
                }))
              }
            />
            <span>Rent</span>
          </label>

          <label class="radio-label">
            <input
              type="radio"
              name="category"
              value="Food"
              onChange={(e) =>
                setSaveExpenseData((prevData) => ({
                  ...prevData,
                  ExpenseType: e.target.value, // Save selected category
                }))
              }
            />
            <span>Food</span>
          </label>

          <label class="radio-label">
            <input
              type="radio"
              name="category"
              value="Groceries"
              onChange={(e) =>
                setSaveExpenseData((prevData) => ({
                  ...prevData,
                  ExpenseType: e.target.value, // Save selected category
                }))
              }
            />
            <span>Groceries</span>
          </label>
        </div>

        <button
          className="simple-button"
          onClick={() => {
            editing ? EditExpense(ExpenseId) : handleSaveChange(id);
          }}
        >
          Add Expense
        </button>
      </div>

      {expenses.length > 0 ? (
        <ExpenseTable
          expenses={expenses}
          handleEditData={handleEditData}
          editing={editing}
          SaveEdit={EditExpense}
          handleDelete={handleDelete}
          id={id}
          // EditExpense={EditExpense}
          // onDelete={handleDelete}
        />
      ) : (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          No expenses found
        </p>
      )}
    </div>
  );
};

export default Home;

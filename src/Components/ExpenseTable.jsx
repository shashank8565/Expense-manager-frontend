import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ExpenseTable = ({
  expenses,
  handleEditData,
  editing,
  SaveEdit,
  handleDelete,
  id,
}) => {
  return (
    <TableContainer
      component={Paper}
      style={{
        marginTop: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxHeight: "350px", // Set max height for scrolling
        overflowY: "auto", // Enable vertical scrolling
        gridColumn: "span 2",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Table>
        <TableHead>
          <TableRow style={{ background: "#007bff" }}>
            <TableCell
              style={{
                color: "white",
                fontWeight: "bold",

                fontFamily: "Poppins, sans-serif",
              }}
            >
              Expense Type
            </TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>
              Expense Cost
            </TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>
              Expense Data
            </TableCell>
            <TableCell
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense, index) => (
            <TableRow key={index} hover>
              <TableCell>{expense.ExpenseType}</TableCell>
              <TableCell>₹{expense.ExpenseCost}</TableCell>
              <TableCell>
                {new Date(expense.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  fontFamily: "poppins",
                  fontWeight: 400,
                }}
              >
                <IconButton
                  onClick={() =>
                    handleEditData(
                      expense.ExpenseCost,
                      expense.ExpenseType,
                      expense._id
                    )
                  }
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(id, expense._id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpenseTable;

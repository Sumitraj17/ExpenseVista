import { Router } from "express";
import validator from "../middelware/validate.middleware.js";
import { addBill, getMonthExpense,getDayExpense,getPastThreeMonthsExpenses} from "../controller/expense.controller.js";
const Expense = Router();


Expense.post("/addBill",validator,addBill)
Expense.post("/daily-expense",validator,getDayExpense);
Expense.post("/monthly",validator,getMonthExpense);
Expense.get("/details",validator,getPastThreeMonthsExpenses)

export default Expense
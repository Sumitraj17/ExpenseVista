import express, { urlencoded } from "express";
import connectToDB from "./DB/db.js";
import router from "./Routes/userRouter.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import Expense from "./Routes/expenseRouter.js";
import cors from "cors"; // Import cors

const App = express();
connectToDB();

// Allow all origins with CORS
App.use(cors({ origin: "https://expensevista.netlify.app", credentials: true }));

App.use(express.json());
App.use(cookieParser());
App.use(express.urlencoded({ extended: true }));

App.use("/user", router);
App.use("/expense", Expense);

App.listen(process.env.PORT, () => {
  console.log(`Listening on port:- ${process.env.PORT}`);
});

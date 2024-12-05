import { User } from "../Model/User.Model.js";
import mongoose from "mongoose";
export const addBill = async (req, res) => {
  try {
    const {title, cost, description, date } = req.body;

    // Validate input fields
    if (!title || !cost || !description) {
      return res
        .status(400)
        .json({ status: "Bad Request", message: "All fields required" });
    }
    console.log(date);
    const user = req.user; // Assumes `req.user` is already populated by middleware

    // Use the provided date or default to the current date
    const inputDate = (() => {
          const d = new Date(date||'');
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        })();
    console.log(inputDate)
    // Find the expense entry for the specified date
    const existingBillEntry = user.expenses.find((item) => item.date === inputDate);

    if (!existingBillEntry) {
      // No existing bill entry for the specified date, create a new one
      user.expenses.push({
        total: cost,
        date: inputDate,
        bills: [
          {
            title: title,
            cost: cost,
            description: description,
          },
        ],
      });
    } else {
      // Bill entry for the specified date exists, so add the new bill and update the total
      existingBillEntry.bills.push({
        title: title,
        cost: cost,
        description: description,
      });
      existingBillEntry.total += Number(cost); // Update the total cost for the date
    }

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ status: "Success", message: "Bill added successfully", user });
  } catch (error) {
    console.error("Error in addBill:", error.message); // Log error for debugging
    return res.status(500).json({
      status: "Internal Server Error",
      message: "Something went wrong",
    });
  }
};


// import mongoose from "mongoose";

export const getDayExpense = async (req, res) => {
  const userId = req.user._id; // User ID from middleware
  const { date } = req.body;  // Expected format: DD-MM-YYYY

  try {
    console.log("Date from request:", date);

    // Use MongoDB's aggregation to filter expenses for the specific date
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match user by ID
      {
        $project: {
          expenses: {
            $filter: {
              input: "$expenses", // Array to filter
              as: "expense",      // Alias for each array element
              cond: { $eq: ["$$expense.date", date] }, // Match on DD-MM-YYYY format
            },
          },
        },
      },
    ]);

    console.log("Aggregation Result:", result);

    // Handle no result or empty expenses
    if (!result || result.length === 0 || result[0].expenses.length === 0) {
      return res.status(200).json({
        status: "Success",
        message: "No expenses found for the given date",
        data: {
          total: 0,
          bills: [],
        },
      });
    }

    // Extract the day's expenses
    const { total, bills } = result[0].expenses[0]; // First matching expense

    return res.status(200).json({
      status: "Success",
      message: "Request Resolved",
      data: {
        total: total || 0,
        bills: bills || [],
      },
    });
  } catch (error) {
    console.error("Error in getDayExpense:", error.message);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "Something went wrong",
    });
  }
};


// get month


export const getMonthExpense = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from middleware
    const { month, year } = req.body;

    // Validate month and year input
    if (!month || !year) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Month and year are required",
      });
    }

    const monthStr = String(month).padStart(2, "0"); // Ensure month is in two-digit format
    const yearStr = String(year); // Ensure year is a string

    // Use aggregation to filter expenses for the given month and year
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match user by ID
      {
        $project: {
          expenses: {
            $filter: {
              input: "$expenses", // Array to filter
              as: "expense",      // Alias for each array element
              cond: {
                $and: [
                  { $eq: [{ $substr: ["$$expense.date", 3, 2] }, monthStr] }, // Match month
                  { $eq: [{ $substr: ["$$expense.date", 6, 4] }, yearStr] },  // Match year
                ],
              },
            },
          },
        },
      },
    ]);

    // If no expenses found, return a 404 response
    if (!result || result.length === 0 || result[0].expenses.length === 0) {
      return res.status(404).json({
        status: "Not Found",
        message: "No expenses found for the given month and year",
      });
    }

    // Return the filtered expenses
    return res.status(200).json({
      status: "Success",
      message: "Monthly expenses retrieved successfully",
      data: result[0].expenses, // Filtered expenses
    });
  } catch (error) {
    console.error("Error in getMonthExpense:", error.message);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "Something went wrong",
    });
  }
};


export const getPastThreeMonthsExpenses = async (req, res) => {
  try {
    const user = req.user; // Assumes `req.user` is populated by middleware
    const currentDate = new Date();

    // Calculate the current month and year
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = currentDate.getFullYear();

    // Array to store total expenses for the past 3 months
    const monthTotals = [];

    // Array to map month numbers to names
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    for (let i = 0; i < 3; i++) {
      const month =
        currentMonth - i <= 0 ? currentMonth - i + 12 : currentMonth - i; // Adjust for year rollover
      const year = currentMonth - i <= 0 ? currentYear - 1 : currentYear;

      // Get month name and year
      const monthStr = monthNames[month - 1]; // Get month name (adjust for 0-based index)
      const yearStr = String(year); // Year as string

      // Calculate the total expenses for the month
      const totalExpense = user.expenses
        .filter((expense) => {
          const [day, expenseMonth, expenseYear] = expense.date.split("-");
          return expenseMonth === String(month).padStart(2, "0") && expenseYear === yearStr;
        })
        .reduce((sum, expense) => sum + expense.total, 0);

      monthTotals.push({
        month: `${monthStr}-${yearStr}`, // Format as "MON-YYYY"
        totalExpense,
      });
    }
    const send_user = await User.findOne({_id:user._id}).select("firstname lastname email")
    return res.status(200).json({
      status: "Success",
      message: "Past 3 months' expenses retrieved successfully",
      monthTotals,
      user:send_user
    });
  } catch (error) {
    console.error("Error in getPastThreeMonthsExpenses:", error.message);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "Something went wrong",
    });
  }
};



// export 
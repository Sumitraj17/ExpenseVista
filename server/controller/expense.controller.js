import { User } from "../Model/User.Model.js";

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

export const getDayExpense = async (req, res) => {
  const user = req.user; // Assumes user data is preloaded via middleware
  const { date } = req.body;

  try {
    // Find the expense for the given date
    const expenses = user.expenses.find((item) => item.date === date);

    if (!expenses) {
      return res.status(200).json({
        status: "Success",
        message: "No expenses found for the given date",
        data: {
          total: 0,
        },
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Request Resolved",
      data: {
        total: expenses.total,
        bills: expenses.bills, // Accessing the correct field `bills`
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
    const user = req.user; // Assumes `req.user` is populated by middleware
    const { month, year } = req.body;

    // Validate month and year input
    if (!month || !year) {
      return res
        .status(400)
        .json({
          status: "Bad Request",
          message: "Month and year are required",
        });
    }

    const monthStr = String(month).padStart(2, "0"); // Ensure month is two digits
    const yearStr = String(year); // Ensure year is a string

    // Filter expenses by the given month and year
    const dailyExpenses = user.expenses
      .filter((expense) => {
        const [day, expenseMonth, expenseYear] = expense.date.split("-");
        return expenseMonth === monthStr && expenseYear === yearStr;
      })
      .map((expense) => ({
        date: expense.date,
        total: expense.total,
        bills: expense.bills,
      }));

    if (dailyExpenses.length === 0) {
      return res.status(404).json({
        status: "Not Found",
        message: "No expenses found for the given month and year",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Daily expenses retrieved successfully",
      data:dailyExpenses,
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
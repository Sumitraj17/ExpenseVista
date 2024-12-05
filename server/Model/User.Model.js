import mongoose from "mongoose";



// Schema for daily expenses
const billSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      default: 0,
    },
    date: {
      type: String, // Store the date as a formatted string
    },
    bills: [
      {
        id:{
          type:Number,
          // required:[true,"Bill title is required"]
        },
        title: {
          type: String,
          required: [true, "Bill title is required"],
        },
        cost: {
          type: Number,
          required: [true, "Bill cost is required"],
          min: [0, "Cost must be a positive number"],
        },
        description: {
          type: String,
          required: [true, "Bill description is required"],
        },
      },
    ],
  },
  { timestamps: true } // Auto-adds `createdAt` and `updatedAt`
);
// schema for each user
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      
    },
    expenses:[billSchema]
  },
  { timestamps: true }
);


export const User =  mongoose.model('User',userSchema);
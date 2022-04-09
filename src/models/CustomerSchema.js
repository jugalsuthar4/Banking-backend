const mongoose = require("mongoose");
const moment = require("moment");
const customerSchema = new mongoose.Schema({
  customerID: String,
  name: String,
  email: String,
  balance: Number,
});

const TransactionSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  amount: Number,
  date: String,
  time: String,
});
const LoginSchema = new mongoose.Schema({
  email: String,
  pin: String,
});
const signupSchema = new mongoose.Schema({
  email: String,
  pin: String,
  phone: String,
});
const Transaction = new mongoose.model("Transaction", TransactionSchema);
const Customer = new mongoose.model("Customer", customerSchema);
const Signup = new mongoose.model("Signup", signupSchema);
module.exports = { Transaction, Customer, Signup };

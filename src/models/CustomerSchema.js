const mongoose=require('mongoose');
const moment=require('moment');
const customerSchema=new mongoose.Schema({
    customerID:String,
    name:String,
    email:String,
    balance:Number,
})

const TransactionSchema=new mongoose.Schema({
    sender:String,
    receiver:String,
    amount:Number,
    date:String,
    time:String
})
const Transaction=new mongoose.model('Transaction',TransactionSchema);
const Customer=new mongoose.model('Customer',customerSchema);
module.exports = {Transaction, Customer};
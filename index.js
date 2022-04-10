const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const {
  Customer,
  Transaction,
  Signup,
} = require("./src/models/CustomerSchema.js");
const moment = require("moment");

const port = process.env.PORT || 5000;
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(express.urlencoded({ extended: false }));
require("./src/db/conn");
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).sender("<h1>the sparks foundation banking</h1>");
});
app.get("/getcustomers", (req, res) => {
  console.log("cutomer called");
  Customer.find()
    .then((data) => {
      res.status(200).json({ data: data });
    })
    .catch(() => console.log("unable to retrieve data"));
});
app.post("/add", (req, res) => {});
app.post("/singlecustomer", async (req, res) => {
  console.log(req.body.id);
  Customer.find({ _id: req.body.id })
    .then((data) => {
      console.log(data);
      res.status(200).json({ data: data });
    })
    .catch((data) => {
      res.status(501).json({ msg: "something went wrong" });
    });
});
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const Singupuser = new Signup({
    email: req.body.email,
    pin: req.body.pin,
    phone: req.body.phone,
  });
  Singupuser.save()
    .then((data) => {
      console.log("user registerd ");
      res.status(200).json({ data: data });
    })
    .catch((data) => {
      res.status(500).json({ msg: "something went wrong" });
    });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let pin = req.body.pin;
  Signup.find({ email: email })
    .then((data) => {
      if (data[0].pin == pin) {
        Customer.find({ email: data[0].email })
          .then((customer) => res.status(200).json({ data: customer[0]._id }))
          .catch((err) =>
            res.status(500).json({ msg: "something went wrong" })
          );
      } else {
        res.status(400).json({ msg: "invalid credentials" });
      }
    })
    .catch((data) => res.status(500).json({ msg: "something went wrong" }));
});
app.post("/transaction", async (req, res) => {
  console.log(req.body);
  const sender = await Customer.find({ _id: req.body.sender });
  const reciever = await Customer.find({ _id: req.body.reciever });
  console.log(sender);
  const amount = parseInt(req.body.amount);
  const senderBalance = parseInt(sender[0].balance);
  const recieverBalance = parseInt(reciever[0].balance);
  Customer.findOneAndUpdate(
    { _id: req.body.sender },
    { balance: senderBalance - amount }
  )
    .then(() => {
      Customer.findOneAndUpdate(
        { _id: req.body.reciever },
        { balance: recieverBalance + amount }
      )
        .then(() => {
          const transaction = new Transaction({
            sender: sender[0].name,
            receiver: reciever[0].name,
            amount: amount,
            date: moment().format("MMM Do YY"),
            time: moment().format("LT"),
          });
          transaction
            .save()
            .then(() => console.log("entry done"))
            .catch(() => console.log("entry not done"));
          res.status(200).json({ msg: "transaction successful" });
        })
        .catch(() => {
          res.status(500).json({ msg: "transaction failed" });
        });
    })
    .catch(() => {
      res.status(500).json({ msg: "transaction failed" });
    });
});
app.get("/findone/:id", async (req, res) => {
  console.log("api involked");
  console.log(req.params);
  Customer.find({ _id: req.params.id }).then((data) =>
    res.status(200).json({ user: data })
  );
});
app.get("/passbook/:id", async (req, res) => {
  Customer.find({ _id: req.params.id }).then((data) => {
    //console.log(data[0].name)
    Transaction.find({
      $or: [{ sender: data[0].name }, { reciever: data[0].name }],
    }).then((data) => {
      res.status(200).json({ data: data });
    });
  });
});
app.get("/transferdata", (req, res) => {
  console.log(Transaction);
  Transaction.find()
    .then((data) => {
      console.log(data);
      res.status(200).json({ data: data });
    })
    .catch(() => {
      res.status(500).json({ msg: "can'tretrieve transactions" });
    });
});
app.listen(port, () => {
  console.log(`post ${port}`);
});

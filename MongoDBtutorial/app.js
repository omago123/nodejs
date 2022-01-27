import express from "express"
import dotenv from "dotenv";
import mongoose from "mongoose";
import Customer from "./model/customer";

const app = express();
app.use(express.json());
 

dotenv.config({path:'.env-local'}); 

const port = process.env.PORT
const uri = process.env.DB_CONNECTION;

mongoose.connect(uri);
  
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully.");
  });
  
  app.get("/customerlist", async (req, res) => {
    await Customer.find({}, (err, result) => {
      console.log("customer from db: ", result);
      res.send(result);
    }).clone().catch((err)=>{console.log(err)});
  });
  
  app.post("/customer", async (req, res) => {
    try {
      console.log("req.body: ", req.body);
  
      const newCustomer = new Customer({
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
      });
  
      await Customer.create(newCustomer);
      res.send("Customer added");
    } catch (err) {
      console.log("error: ", err);
    }
  });
  
  app.listen(port, () => {
    console.log(`App is listening at http://locahost:${port}`);
  });



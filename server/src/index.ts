//s4Nex1fLVDOrjw91

import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-record"
import cors from "cors"

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())
app.use("/financial-records", financialRecordRouter)

const mongoURI: string =
  "mongodb+srv://sao111053:s4Nex1fLVDOrjw91@personalfinancetracker.ujfxh.mongodb.net/";

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECT TO MONGODB!"))
  .catch((err) => console.error("Failed to Connect to MongoDB", err));

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
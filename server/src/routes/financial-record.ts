import express, { Express, Request, Response, Router } from "express";
import FinancialRecordModel from "../schema/financial-record";

const router: Router = express.Router();

router.get("/getAllByUserId/:userId", async (req: Request, res: any) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecordModel.find({ userId: userId });
    if (records.length === 0) {
      return res.status(400).json({ message: "No record found for the user." });
    }
    res.status(200).json(records);
  } catch (err) {
    res.status(200).send(err);
  }
});

//Create Record and Update to MonogoDB
router.post("/", async (req: Request, res: any) => {
  try {
    const newRecordBody = req.body; //as an object. The content of req.body comes directly from the client,
    const newRecord = new FinancialRecordModel(newRecordBody); //newRecordBody Object truns into MongoDB Object. This syntax creates a new instance of the model, which represents a new document that can be saved to the database.
    const saveRecord = await newRecord.save();

    res.status(200).send(saveRecord);
  } catch (err) {
    res.status(200).send(err);
  }
});

//Update
router.put("/:id", async (req: Request, res: any) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body; //as an object
    const record = await FinancialRecordModel.findByIdAndUpdate(
      id,
      newRecordBody
    );

    if (!record) return res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(200).send(err);
  }
});

//Delete
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body; //as an object
    const record = await FinancialRecordModel.findByIdAndDelete(
      id,
      newRecordBody
    );

    if (!record) return res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(200).send(err);
  }
});
export default router;

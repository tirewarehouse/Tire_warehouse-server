const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
});

const tireHistorySchema = new mongoose.Schema(
  {
    carNumber: { type: String, required: true },
    company: { type: String, required: true },
    dateIn: { type: Date, required: true },
    dateOut: { type: Date, required: false },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
    warehouse: { type: String, required: true },
    locations: { type: [locationSchema], required: true },
    memo: { type: String },
    creator: { type: String, required: true },
    historyType: { type: String, required: true },
    historyMemo: { type: String, required: false },
  },
  { timestamps: true }
);

const TireHistory = mongoose.model("TireHistory", tireHistorySchema);

module.exports = TireHistory;

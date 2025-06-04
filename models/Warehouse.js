const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  memo: { type: String, required: false },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;

const express = require("express");
const router = express.Router();
const Warehouse = require("../models/Warehouse");

const baseUrl = "/warehouses";

router.get(baseUrl, async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    console.error("❌ 창고 조회 실패:", err);
    res.status(500).json({ message: "창고 조회 실패" });
  }
});

router.post(baseUrl, async (req, res) => {
  const { name, memo } = req.body;
  const exists = await Warehouse.findOne({ name });
  if (exists) {
    return res.status(400).json({ message: "이미 존재하는 창고입니다." });
  }
  try {
    const newWarehouse = new Warehouse({ name, memo });
    await newWarehouse.save();
    res.status(201).json(newWarehouse);
  } catch (err) {
    console.error("❌ 창고 생성 실패:", err);
    res.status(500).json({ message: "창고 생성 실패" });
  }
});

router.delete(baseUrl, async (req, res) => {
  const { id } = req.params;
  try {
    await Warehouse.findByIdAndDelete(id);
    res.json({ message: "창고 삭제 성공" });
  } catch (err) {
    console.error("❌ 창고 삭제 실패:", err);
    res.status(500).json({ message: "창고 삭제 실패" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const TireHistory = require("../models/TireHistory");

router.get("/histories", async (req, res) => {
  try {
    const history = await TireHistory.find();
    res.json(history);
  } catch (err) {
    console.error("❌ 타이어 이력 조회 실패:", err);
    res.status(500).json({ message: "타이어 이력 조회 실패" });
  }
});

router.post("/histories", async (req, res) => {
  try {
    const newHistory = new TireHistory(req.body);
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    console.error("❌ 타이어 이력 생성 실패:", err);
    res.status(500).json({ message: "타이어 이력 생성 실패" });
  }
});

router.delete("/histories/:id", async (req, res) => {
  try {
    await TireHistory.findByIdAndDelete(req.params.id);
    res.json({ message: "타이어 이력 삭제 성공" });
  } catch (err) {
    console.error("❌ 타이어 이력 삭제 실패:", err);
    res.status(500).json({ message: "타이어 이력 삭제 실패" });
  }
});

module.exports = router;

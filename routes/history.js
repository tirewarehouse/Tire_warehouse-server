const express = require("express");
const router = express.Router();
const TireHistory = require("../models/TireHistory");
const Tire = require("../models/Tire");

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
  const { carNumber, company, type, quantity, locations, memo, dateIn, dateOut, warehouse, creator, historyType } = req.body;
  try {
    const newHistory = new TireHistory({
      carNumber,
      company,
      type,
      quantity,
      locations,
      memo,
      dateIn: dateIn ? new Date(dateIn) : new Date(),
      dateOut: dateOut ? new Date(dateOut) : undefined,
      warehouse,
      creator,
      historyType,
    });
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

router.put("/histories/:id", async (req, res) => {
  try {
    const findHistory = await TireHistory.findById(req.params.id);
    const findTire = await Tire.findOne({ carNumber: findHistory.carNumber });
    if (!findHistory) {
      return res.status(404).json({ message: "타이어 이력을 찾을 수 없습니다." });
    }
    if (findTire) {
      await Tire.findOneAndUpdate(
        { carNumber: findHistory.carNumber },
        {
          $set: {
            dateIn: findHistory.dateIn,
            dateOut: findHistory.dateOut,
            quantity: findHistory.quantity,
            type: findHistory.type,
            warehouse: findHistory.warehouse,
            locations: findHistory.locations,
            memo: findHistory.memo,
          },
        },
        { new: true }
      );
    } else {
      await Tire.create({
        carNumber: findHistory.carNumber,
        company: findHistory.company,
        dateIn: findHistory.dateIn,
        dateOut: findHistory.dateOut,
        quantity: findHistory.quantity,
        type: findHistory.type,
        warehouse: findHistory.warehouse,
        locations: findHistory.locations,
        memo: findHistory.memo,
      });
    }
    await TireHistory.create({
      carNumber: findHistory.carNumber,
      company: findHistory.company,
      dateIn: findHistory.dateIn,
      dateOut: findHistory.dateOut,
      quantity: findHistory.quantity,
      type: findHistory.type,
      warehouse: findHistory.warehouse,
      locations: findHistory.locations,
      memo: findHistory.memo,
      creator: req.body.creator,
      historyType: "ROLLBACK",
      historyMemo: findHistory._id + " 데이터 원복",
    });
    res.json({ message: "타이어 이력 수정 성공", success: true });
  } catch (err) {
    console.error("❌ 타이어 이력 수정 실패:", err);
    res.status(500).json({ message: "타이어 이력 수정 실패", success: false });
  }
});

module.exports = router;

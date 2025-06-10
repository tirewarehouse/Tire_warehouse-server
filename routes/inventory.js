const express = require("express");
const router = express.Router();
const Tire = require("../models/Tire");

// ✅ 입고 등록
router.post("/in", async (req, res) => {
  const { carNumber, company, type, quantity, locations, memo, dateIn, dateOut, warehouse } = req.body;

  if (!carNumber || !company || !type || !quantity || !locations?.length) {
    return res.status(400).json({ message: "❗ 필수값 누락" });
  }

  try {
    const exists = await Tire.findOne({ carNumber });
    if (exists) {
      return res.status(409).json({ message: "❌ 이미 등록된 차량번호입니다." });
    }

    const newTire = await Tire.create({
      carNumber,
      company,
      type,
      quantity,
      locations,
      memo,
      dateIn: dateIn ? new Date(dateIn) : new Date(),
      dateOut: dateOut ? new Date(dateOut) : undefined,
      warehouse,
    });

    res.status(201).json({ message: "✅ 입고 성공", data: newTire });
  } catch (err) {
    console.error("❌ 입고 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 위치 중복 확인
router.get("/check-location", async (req, res) => {
  const { x, y, z } = req.query;

  if (!x || !y || !z) {
    return res.status(400).json({ message: "x, y, z 모두 필요합니다." });
  }

  try {
    const exists = await Tire.findOne({
      locations: {
        $elemMatch: { x: Number(x), y: Number(y), z: Number(z) },
      },
    });

    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "위치 확인 중 오류 발생", error: err });
  }
});

router.get("/check-locations", async (req, res) => {
  const { x, y, z, warehouse } = req.query;
  if (!x || !y || !z) {
    return res.status(400).json({ message: "x, y, z 모두 필요합니다." });
  }
  const tire = await Tire.findOne({
    warehouse,
    locations: {
      $elemMatch: { x: Number(x), y: Number(y), z: Number(z) },
    },
  });
  res.json({ exists: !!tire });
});

router.get("/get-detail", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "id가 필요합니다." });
  }

  const tire = await Tire.findOne({ _id: id });
  res.json(tire);
});

// ✅ 차량번호 중복 확인
router.get("/check-car", async (req, res) => {
  const { carNumber } = req.query;
  if (!carNumber) {
    return res.status(400).json({ message: "차량번호가 필요합니다." });
  }

  try {
    const exists = await Tire.findOne({ carNumber });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "차량번호 중복 확인 중 오류 발생", error: err });
  }
});

// ✅ 재고 일부 수정 (출고일, 메모)
router.put("/update/:carNumber", async (req, res) => {
  const { carNumber } = req.params;
  const { dateOut, memo } = req.body;

  try {
    const updated = await Tire.findOneAndUpdate(
      { carNumber },
      {
        $set: {
          dateOut: dateOut ? new Date(dateOut) : null,
          memo: memo || "",
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "❌ 해당 차량번호를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "✅ 재고 정보 수정 완료", data: updated });
  } catch (err) {
    console.error("❌ 재고 정보 수정 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 재고 전체 수정
router.put("/update-stock", async (req, res) => {
  const { carNumber, dateIn, dateOut, quantity, type, memo, locations } = req.body;

  if (!carNumber) {
    return res.status(400).json({ message: "차량번호는 필수입니다." });
  }

  try {
    const updated = await Tire.findOneAndUpdate(
      { carNumber },
      {
        ...(dateIn !== undefined && { dateIn: new Date(dateIn) }),
        ...(dateOut !== undefined && { dateOut: dateOut ? new Date(dateOut) : null }),
        ...(quantity !== undefined && { quantity }),
        ...(type !== undefined && { type }),
        ...(memo !== undefined && { memo }),
        ...(locations !== undefined && { locations }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "해당 차량번호를 찾을 수 없습니다." });
    }

    res.json({ message: "✅ 재고 정보가 성공적으로 업데이트되었습니다.", updated });
  } catch (err) {
    console.error("❌ 재고 상태 업데이트 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 재고 삭제
router.delete("/delete-stock", async (req, res) => {
  const { carNumber } = req.query;

  if (!carNumber) {
    return res.status(400).json({ message: "차량번호가 필요합니다." });
  }

  try {
    const deleted = await Tire.findOneAndDelete({ carNumber });

    if (!deleted) {
      return res.status(404).json({ message: "❌ 해당 차량번호를 찾을 수 없습니다." });
    }

    res.json({ message: "✅ 삭제 완료" });
  } catch (err) {
    console.error("❌ 삭제 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;

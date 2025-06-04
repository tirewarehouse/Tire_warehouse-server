// server/routes/admin.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Tire = require("../models/Tire");
const Company = require("../models/Company"); // ✅ 추가: Company 모델 불러오기

// *** 관리자 관리 ***
// ✅ 관리자 로그인
router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  const name = id;

  if (!id || !password) {
    return res.status(400).json({ message: "이름와 비밀번호를 입력하세요." });
  }

  try {
    const allAdmins = await Admin.find();
    console.log("📋 전체 관리자 목록:", allAdmins);

    const admin = await Admin.findOne({ name });
    console.log("🔍 조회된 관리자:", admin);

    if (!admin || admin.password !== password) {
      console.log("❌ 로그인 실패 조건 통과 못함");
      return res.status(401).json({ message: "❌ 잘못된 아이디 또는 비밀번호입니다." });
    }

    res.status(200).json({ message: "✅ 로그인 성공!", name: admin.name });
  } catch (error) {
    console.error("로그인 중 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/add-admin", async (req, res) => {
  const { name, password, phone } = req.body;
  try {
    const exists = await Admin.findOne({ name });
    if (exists) {
      return res.status(500).json({ message: "❌ 이미 등록된 이름입니다." });
    }
    await Admin.create({ name, password, phone });
    res.status(200).json({ message: "✅ 관리자 추가 성공", success: true });
  } catch (err) {
    res.status(500).json({ message: "❌ 관리자 추가 오류", success: false });
  }
});

router.put("/update-admin", async (req, res) => {
  const { name, password, newPassword } = req.body;

  try {
    const exists = await Admin.findOne({ name, password });
    if (!exists) {
      return res.status(500).json({ message: "❌ 변경 전 비밀번호가 일치하지 않습니다." });
    }
    await Admin.updateOne({ name }, { $set: { password: newPassword } });
    res.status(200).json({ message: "✅ 관리자 정보 수정 성공", success: true });
  } catch (err) {
    res.status(500).json({ message: "❌ 관리자 정보 수정 오류", success: false });
  }
});

router.delete("/delete-admin", async (req, res) => {
  const { name } = req.query;
  try {
    const deleted = await Admin.findOneAndDelete({ name });
    if (!deleted) {
      return res.status(500).json({ message: "❌ 해당 관리자를 찾을 수 없습니다.", success: false });
    }
    res.json({ message: "✅ 관리자 삭제 성공", success: true });
  } catch (err) {
    res.status(500).json({ message: "❌ 관리자 삭제 오류", success: false });
  }
});

router.get("/get-admins", async (req, res) => {
  try {
    const admins = await Admin.find({ name: { $ne: "관리자" } });
    res.json(admins);
  } catch (err) {
    console.error("❌ 관리자 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// *** 타이어 관리 ***

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

// ✅ 회사 목록 불러오기
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error("❌ 회사 목록 불러오기 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 회사 추가
router.post("/companies", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "회사 이름은 필수입니다." });
  }
  try {
    const exists = await Company.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "❗ 이미 존재하는 회사입니다." });
    }
    const newCompany = await Company.create({ name });

    // ✅ 이 부분을 프론트 형식에 맞게 응답
    res.status(201).json(newCompany);
  } catch (err) {
    console.error("❌ 회사 추가 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 회사 삭제
router.delete("/companies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Company.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "❌ 해당 회사를 찾을 수 없습니다." });
    }
    res.json({ message: "✅ 회사 삭제 성공" });
  } catch (err) {
    console.error("❌ 회사 삭제 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;

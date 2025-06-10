const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

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

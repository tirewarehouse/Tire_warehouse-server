// server/routes/admin.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// ✅ 관리자 로그인
router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  const name = id;

  if (!id || !password) {
    return res.status(400).json({ message: "이름와 비밀번호를 입력하세요." });
  }

  try {
    const admin = await Admin.findOne({ name });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "❌ 잘못된 아이디 또는 비밀번호입니다." });
    }

    res.status(200).json({ message: "✅ 로그인 성공!", name: admin.name, success: true });
  } catch (error) {
    res.status(500).json({ message: "서버 오류", success: false });
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

module.exports = router;

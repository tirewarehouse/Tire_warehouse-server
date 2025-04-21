// ✅ [추가된 코드] 타이어 입고용 라우터
const express = require('express');
const router = express.Router();
const Tire = require('../models/Tire');

// 입고 API
router.post('/add', async (req, res) => {
  try {
    const newTire = new Tire(req.body); // 요청으로 받은 데이터로 객체 생성
    const savedTire = await newTire.save(); // MongoDB에 저장
    res.status(201).json(savedTire); // 저장된 결과 반환
  } catch (err) {
    console.error('❌ 입고 실패:', err);
    res.status(400).json({ message: '입고 실패', error: err.message });
  }
});

module.exports = router;
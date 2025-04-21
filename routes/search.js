// server/routes/search.js

const express = require('express');
const router = express.Router();
const Tire = require('../models/Tire');

// GET /api/search?carNumber=12가1234
router.get('/', async (req, res) => {
    const keyword = req.query.keyword; // 이 부분!
    console.log('🔍 서버에서 받은 검색어:', keyword); // ✅ 이 줄 추가
    
    if (!keyword) {
      return res.status(400).json({ message: '검색어가 필요합니다.' });
    }
  
    try {
      // 🔍 여러 필드를 대상으로 부분 일치 검색
      const results = await Tire.find({
        $or: [
          { carNumber: { $regex: keyword, $options: 'i' } }, // 대소문자 무시
          { company: { $regex: keyword, $options: 'i' } },
          { type: { $regex: keyword, $options: 'i' } }
        ]
      });
  
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: '검색 오류', error });
    }
  });

// ✅ 임시 전체 데이터 조회용 라우트
router.get('/all', async (req, res) => {
    try {
      const allTires = await Tire.find();
      res.json(allTires);
    } catch (error) {
      res.status(500).json({ message: '전체 데이터 조회 실패', error });
    }
  });
  
router.post('/', async (req, res) => {
  try {
    const newTire = new Tire(req.body); // 요청으로 받은 데이터를 모델로 생성
    await newTire.save();
    res.status(201).json({ message: '타이어 데이터 저장 성공', tire: newTire });
  } catch (error) {
    console.error('❌ 데이터 저장 실패:', error);
    res.status(500).json({ message: '데이터 저장 실패', error });
  }
});

module.exports = router;
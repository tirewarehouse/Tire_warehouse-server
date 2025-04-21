// server/scripts/insertDummy.js

require('dotenv').config(); // .env에서 MONGODB_URI 읽어옴
const mongoose = require('mongoose');
const Tire = require('../models/Tire'); // 타이어 모델 불러오기

// 샘플 데이터 정의
const dummyTires = [
  {
    carNumber: "11가1111",
    company: "타이어킹",
    quantity: 4,
    type: "겨울용",
    locations: [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: 2 },
      { x: 1, y: 2, z: 1 },
      { x: 1, y: 2, z: 2 }
    ],
    memo: "스노우 타이어",
  },
  {
    carNumber: "22나2222",
    company: "타이어나라",
    quantity: 2,
    type: "사계절용",
    locations: [
      { x: 2, y: 3, z: 1 },
      { x: 2, y: 3, z: 2 }
    ],
    memo: "교체용"
  },
  {
    carNumber: "33다3333",
    company: "타이어존",
    quantity: 4,
    type: "여름용",
    locations: [
      { x: 3, y: 1, z: 1 },
      { x: 3, y: 1, z: 2 },
      { x: 3, y: 2, z: 1 },
      { x: 3, y: 2, z: 2 }
    ],
    memo: "고성능 차량용"
  },
  {
    carNumber: "44라4444",
    company: "타이어마스터",
    quantity: 1,
    type: "사계절용",
    locations: [
      { x: 4, y: 1, z: 1 }
    ],
    memo: "임시 보관"
  },
  {
    carNumber: "55마5555",
    company: "타이어하우스",
    quantity: 2,
    type: "겨울용",
    locations: [
      { x: 5, y: 2, z: 1 },
      { x: 5, y: 2, z: 2 }
    ],
    memo: ""
  },
  {
    carNumber: "66바6666",
    company: "타이어월드",
    quantity: 3,
    type: "사계절용",
    locations: [
      { x: 6, y: 3, z: 1 },
      { x: 6, y: 3, z: 2 },
      { x: 6, y: 3, z: 3 }
    ],
    memo: "테스트용"
  },
  {
    carNumber: "77사7777",
    company: "타이어탑",
    quantity: 4,
    type: "사계절용",
    locations: [
      { x: 7, y: 4, z: 1 },
      { x: 7, y: 4, z: 2 },
      { x: 7, y: 4, z: 3 },
      { x: 7, y: 4, z: 4 }
    ],
    memo: "장기보관"
  },
  {
    carNumber: "88아8888",
    company: "타이어존",
    quantity: 2,
    type: "여름용",
    locations: [
      { x: 8, y: 1, z: 1 },
      { x: 8, y: 1, z: 2 }
    ],
    memo: ""
  },
  {
    carNumber: "99자9999",
    company: "타이어천국",
    quantity: 4,
    type: "겨울용",
    locations: [
      { x: 9, y: 2, z: 1 },
      { x: 9, y: 2, z: 2 },
      { x: 9, y: 2, z: 3 },
      { x: 9, y: 2, z: 4 }
    ],
    memo: "VIP 고객"
  }
];

// MongoDB 연결 후 삽입
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Tire.insertMany(dummyTires);
    console.log('✅ 테스트 데이터 삽입 완료!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ 데이터 삽입 실패:', err);
  });
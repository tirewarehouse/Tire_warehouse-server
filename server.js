require('dotenv').config(); // ✅ 반드시 최상단에!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MONGO_URI = process.env.MONGODB_URI;
const app = express();
const PORT = 5001;

// ✅ CORS 허용 설정 (🔧 여기 수정)
const allowedOrigins = [
  'http://localhost:3000', // 로컬 개발용
  'https://tire-warehouse-client.vercel.app' // ✅ 실제 배포된 프론트 주소 (예시)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ CORS 차단됨: ' + origin));
    }
  }
}));

app.use(express.json());

// ✅ 라우터 등록
const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const optionsRoutes = require('./routes/options');
app.use('/api/options', optionsRoutes);

// ✅ 기본 라우트
app.get('/', (req, res) => {
  res.send('타이어 창고 백엔드 서버 실행 중!');
});

// ✅ DB 연결
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공!');
    console.log('📌 연결된 DB 이름:', mongoose.connection.name);
  })
  .catch((err) => console.error('❌ MongoDB 연결 실패:', err));

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
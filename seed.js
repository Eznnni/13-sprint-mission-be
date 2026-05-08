import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const seedData = [
  {
    name: "자전거",
    description: "따릉따릉 자전거입니다",
    price: 100000,
    tags: "운송수단",
  },
  {
    name: "자동차",
    description: "부릉부릉 자동차입니다",
    price: 5000000,
    tags: "운송수단",
  },
  {
    name: "컴퓨터",
    description: "최고사양 컴퓨터입니다",
    price: 1000000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 100000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 200000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 300000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 400000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 500000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 600000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 7100000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 8100000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 9100000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 37100000,
    tags: "전자기기",
  },
  {
    name: "헤드셋",
    description: "최고사양 헤드셋입니다",
    price: 6100000,
    tags: "전자기기",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ DB 연결 성공");

  await Product.deleteMany({});
  console.log("🗑️ 기존 데이터 삭제 완료");

  await Product.insertMany(seedData);
  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log("👋 DB 연결 종료");
}

seed();

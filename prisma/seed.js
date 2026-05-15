import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.article.deleteMany();
  console.log("🧹 기존 데이터 삭제 완료");

  const products = [
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
    {
      name: "비타민C",
      description: "몸에 좋은 비타민C 입니다!",
      price: 20000,
      tags: ["식품", "영양제"],
    },
    {
      name: "비타민D",
      description: "몸에 좋은 비타민D 입니다!",
      price: 10000,
      tags: ["식품", "영양제"],
    },
  ];

  for (const item of products) {
    const { tags, ...rest } = item;

    await prisma.product.create({
      data: {
        ...rest,
        tags: {
          connectOrCreate: (Array.isArray(tags) ? tags : [tags]).map(
            (tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            }),
          ),
        },
      },
    });
  }

  console.log(`🌱 product 시드 데이터 ${products.length}개 삽입 완료`);

  const articles = [
    {
      title: "맥북 16인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content: "맥북 16인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
    },
    {
      title: "맥북 17인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content: "맥북 17인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
    },
    {
      title: "맥북 18인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content: "맥북 18인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
    },
    {
      title: "맥북 19인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content: "맥북 19인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
    },
    {
      title: "맥북 20인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content: "맥북 20인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
    },
  ];

  for (const item of articles) {
    const { title, content } = item;
    await prisma.article.create({
      data: {
        title: title,
        content: content,
      },
    });
  }

  console.log(`🌱 article 시드 데이터 ${articles.length}개 삽입 완료`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

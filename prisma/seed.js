import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 🧹 1. 관계 역순으로 기존 데이터 완전 청소 (외래키 제약조건 방어)
  await prisma.productLike.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 기존 데이터 클리닝 완료");

  // 👤 2. 테스트용 더미 유저 생성 (비밀번호는 암호화해서 주입)
  const hashedPassword = await bcrypt.hash("password123!", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "unin5412@gmail.com",
      nickname: "김은진",
      password: hashedPassword,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "panda_market@test.com",
      nickname: "행복한판다",
      password: hashedPassword,
      image:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    },
  });
  console.log("👤 테스트 유저 2명 생성 완료");

  // 📦 3. 상품 시드 데이터 정의 (실제 고화질 이미지 바인딩)
  const productsData = [
    {
      name: "맥북 에어 M2 미개봉 새상품",
      description:
        "선물 받았는데 맥북이 이미 있어서 미개봉 상태로 판매합니다. 에누리 안 됩니다.",
      price: 1200000,
      tags: ["전자기기", "노트북"],
      image: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      ],
    },
    {
      name: "따릉이보다 좋은 접이식 미니벨로",
      description:
        "마실용으로 최적화된 자전거입니다. 시마노 7단 기어 잘 작동합니다.",
      price: 150000,
      tags: ["운송수단", "스포츠"],
      image: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
      ],
    },
    {
      name: "소니 WH-1000XM5 헤드셋 블랙",
      description:
        "노이즈 캔슬링 끝판왕 헤드폰 팝니다. 풀박스 상태이며 실사용 5회 미만입니다.",
      price: 320000,
      tags: ["전자기기", "소형가전"],
      image: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      ],
    },
    {
      name: "캠핑용 원터치 텐트 4인용",
      description:
        "초보자도 3초 만에 칠 수 있는 원터치 텐트입니다. 흙먼지 조금 묻어있어요.",
      price: 45000,
      tags: ["스포츠", "야외활동"],
      image: [
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500",
      ],
    },
    {
      name: "고함량 비타민C 영양제 세트",
      description:
        "가족 건강 선물용으로 샀다가 유통기한 넉넉한 상태로 박스째 당근합니다.",
      price: 25000,
      tags: ["식품", "영양제"],
      image: [
        "https://images.unsplash.com/photo-1616679911721-fe6eec1ae1fe?w=500",
      ],
    },
    {
      name: "아이패드 에어 5세대 64GB Wi-Fi",
      description:
        "인강용 및 필기용으로 쓰다가 기기변경으로 내놓습니다. 케이스 같이 드려요.",
      price: 650000,
      tags: ["전자기기", "태블릿"],
      image: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      ],
    },
    {
      name: "기계식 키보드 저소음 적축",
      description:
        "사무실에서 쓰기 딱 좋은 조용한 저소음 적축 키보드입니다. 타건감 예술입니다.",
      price: 85000,
      tags: ["전자기기", "키보드"],
      image: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      ],
    },
    {
      name: "로지텍 MX Master 3S 마우스",
      description:
        "개발자 및 디자이너 전용 무선 마우스입니다. 무소음 클릭 버전이라 아주 정숙해요.",
      price: 95000,
      tags: ["전자기기", "마우스"],
      image: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
      ],
    },
    {
      name: "가죽 3인용 소파 (네이비)",
      description:
        "이사 가면서 가구 정리하느라 저렴하게 내놓습니다. 용달 부르셔야 합니다.",
      price: 180000,
      tags: ["가구", "인테리어"],
      image: [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500",
      ],
    },
    {
      name: "감성 인테리어 원목 스탠드 조명",
      description:
        "방 분위기 바꿀 때 아주 좋습니다. 따뜻한 노란 전구도 포함해서 드려요.",
      price: 30000,
      tags: ["가구", "조명"],
      image: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
      ],
    },
    {
      name: "나이키 에어포스 1 올백 265mm",
      description:
        "사이즈 미스로 실착 1회 후 보관만 했습니다. 상태 S급 보장합니다.",
      price: 90000,
      tags: ["패션", "신발"],
      image: [
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500",
      ],
    },
    {
      name: "미니 빔프로젝터 가성비 끝판왕",
      description:
        "자취방 넷플릭스 영화관 만들기 가능합니다. 리모컨이랑 삼각대 다 풀박스로 있어요.",
      price: 110000,
      tags: ["전자기기", "영상장비"],
      image: [
        "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500",
      ],
    },
    {
      name: "홈트레이닝용 덤벨 세트 (무게조절)",
      description:
        "집에서 운동하려고 샀다가 옷걸이로만 써서 처분합니다. 양쪽 합쳐서 20kg입니다.",
      price: 40000,
      tags: ["스포츠", "헬스"],
      image: [
        "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500",
      ],
    },
    {
      name: "친환경 대나무 도마 & 칼 세트",
      description:
        "완전 새 상품입니다. 집들이 선물로 받았는데 쓰던 게 있어서 처분해요.",
      price: 15000,
      tags: ["생활용품", "주방"],
      image: [
        "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=500",
      ],
    },
    {
      name: "에스프레소 캡슐 커피머신",
      description:
        "매일 아침 커피 수혈용으로 아주 잘 썼습니다. 세척 완료했고 캡슐 5개 섭스 드림.",
      price: 70000,
      tags: ["전자기기", "주방가전"],
      image: [
        "https://images.unsplash.com/photo-1517668808822-9ebd0046a6e5?w=500",
      ],
    },
  ];

  const createdProducts = [];
  for (const item of productsData) {
    const { tags, ...rest } = item;
    const p = await prisma.product.create({
      data: {
        ...rest,
        writerId: user1.id, // 김은진 유저가 올린 상품으로 등록
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });
    createdProducts.push(p);
  }
  console.log(`🌱 중고 상품 시드 ${createdProducts.length}개 삽입 완료`);

  // 📝 4. 커뮤니티 게시글 시드 데이터 정의
  const articlesData = [
    {
      title: "중고거래 할 때 네고 빌런들 대처법 공유합니다",
      content:
        "와.. 방금 맥북 올렸는데 50만원 깎아달라는 빌런 만났네요. 유저님들은 어떻게 거르시나요?",
      image: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      ],
    },
    {
      title: "오늘 판다마켓 첫 거래 성공했어요!",
      content:
        "자전거 올린 거 쿨거래해주시는 천사 구매자님 만나서 훈훈하게 거래 끝마쳤습니다. 다들 행복하세요.",
      image: [
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500",
      ],
    },
    {
      title: "노트북 중고로 살 때 사기 안 당하는 체크리스트",
      content:
        "1. 직거래 위주로 할 것, 2. 현장에서 배터리 효율 및 불량 화소 테스트 할 것, 3. 박스 일련번호 대조 필수!",
      image: [],
    },
  ];

  const createdArticles = [];
  for (const item of articlesData) {
    const a = await prisma.article.create({
      data: {
        title: item.title,
        content: item.content,
        image: item.image,
        writerId: user2.id, // 행복한판다 유저가 쓴 글들
      },
    });
    createdArticles.push(a);
  }
  console.log(`🌱 커뮤니티 게시글 시드 ${createdArticles.length}개 삽입 완료`);

  // 💬 5. 통합 댓글(Comment) 시드 삽입
  // A. 첫 번째 상품에 2개 유저가 번갈아가며 댓글 대화 연출
  await prisma.comment.create({
    data: {
      content: "안녕하세요! 네고 혹시 조금도 안 될까요?",
      productId: createdProducts[0].id,
      writerId: user2.id,
    },
  });
  await prisma.comment.create({
    data: {
      content: "죄송합니다. 새상품이라 본문에 적힌 가격 그대로만 진행합니다.",
      productId: createdProducts[0].id,
      writerId: user1.id,
    },
  });

  // B. 첫 번째 게시글에 조언 댓글 연출
  await prisma.comment.create({
    data: {
      content:
        "저는 그냥 읽고 답장 안 하거나 무조건 차단 박습니다 ㅋㅋ 그게 정신건강에 이로워요.",
      articleId: createdArticles[0].id,
      writerId: user1.id,
    },
  });
  console.log("💬 상품 및 게시글 연관 댓글 링킹 주입 완료");

  // ❤️ 6. 테스트용 좋아요(Like) 데이터 바인딩 및 카운트 싱크
  // 김은진 유저가 첫 번째 게시글 좋아요 누름
  await prisma.articleLike.create({
    data: { userId: user1.id, articleId: createdArticles[0].id },
  });
  await prisma.article.update({
    where: { id: createdArticles[0].id },
    data: { likeCount: 1 },
  });

  // 행복한판다 유저가 소니 헤드셋 상품 좋아요 누름
  await prisma.productLike.create({
    data: { userId: user2.id, productId: createdProducts[2].id },
  });
  await prisma.product.update({
    where: { id: createdProducts[2].id },
    data: { likeCount: 1 },
  });
  console.log("❤️ 테스트용 좋아요 관계 맵핑 및 Count 싱크 완료");
  console.log("🏁 판다마켓 데이터베이스 시딩 프로세스 완벽 성공!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 구동 중 치명적 에러 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

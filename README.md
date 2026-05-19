# 🐼 판다마켓 프로젝트

> _이 저장소는 판다마켓 프로젝트의 백엔드 코드를 관리하는 곳입니다._ 🛠️

## 소개

안녕하세요! 판다마켓 프로젝트에 오신 것을 환영합니다! 🥳  
판다마켓은 따뜻한 중고거래를 위한 커뮤니티 플랫폼이에요. 여러분은 이곳에서 상품을 등록하고, 다른 사용자들과 소통하며, 자유롭게 이야기를 나눌 수 있어요. 매주 스프린트 미션을 통해 기능을 하나씩 만들어 가며 성장해 나가는 여정을 함께해요. 🚀

![PandaMarket](https://github.com/user-attachments/assets/3784b99f-73c9-4349-a9a9-92b2a7563574)  
_위 이미지는 판다마켓의 대표 이미지입니다._ 📸

## 주요 기능 ✨

1. **상품 등록**: 내가 가진 물건을 올리고, 사진과 설명을 추가해 직접 판매할 수 있어요!
2. **문의 댓글**: 상품에 대한 궁금한 점이나 의견을 자유롭게 남길 수 있답니다. 📝
3. **자유게시판**: 다양한 주제로 친구들과 이야기를 나누고, 정보를 공유할 수 있는 공간이에요! 🗣️

## 기술 스택 🛠️

| 분야             | 기술                 |
| ---------------- | -------------------- |
| **런타임**       | Node.js + Express.js |
| **데이터베이스** | PostgreSQL           |
| **ORM**          | Prisma               |
| **유효성 검사**  | Zod                  |
| **호스팅**       | Render               |
| **개발 도구**    | Nodemon              |

## 시작 🚀

### 1. 의존성 설치

```
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고해주세요

### 3. DB 마이그레이션 및 클라이언트 생성

```
npx prisma migrate dev
npx prisma generate
```

### 4. 데이터 시딩

```
npm run seed
```

### 5. 개발 서버 실행 (Nodemon)

```
npm run dev
```

### 6. 서버 실행

```
npm run start
```

## 저장소 구조 📁

```
.
├── prisma/
│   ├── schema.prisma      # PostgreSQL 테이블 설계
│   └── seed.js            # 초기 데이터 삽입 스크립트
├── src/
│   ├── constants/         # 공통 상수
│   ├── controllers/       # 컨트롤러
│   ├── routes/            # API 엔드포인트 설정
│   ├── schemas/           # Zod를 이용한 유효성 검사 스키마
│   ├── services/          # 비즈니스 로직
│   ├── lib/               # Prisma Client 설정
│   └── utils/             # asyncHandler 등 공통 유틸리티
└── tests/
    ├── articleTest.http   # REST Client article 테스트 파일
    └── productTest.http   # REST Client product 테스트 파일
```

## 아키텍처 🏗️

### 백엔드

- Node.js + Express로 구축
- PostgreSQL + Prisma를 사용한 데이터베이스 작업 처리

### 테이블

| 테이블    | 용도        | 관계                       |
| --------- | ----------- | -------------------------- |
| `Product` | 상품 관리   | 1:N (Comment), M:N (Tag)   |
| `Article` | 게시물 관리 | 1:N (Comment)              |
| `Comment` | 댓글 관리   | Article/Product와 optional |
| `Tag`     | 태그 관리   | M:N (Product)              |

❗ tag의 경우, 후에 태그로 게시물 분류 등의 기능 구현 가능성을 염두하여 M:N으로 설정했습니다.

## API 엔드포인트 📡

### 상품 관리 라우트

| 엔드포인트               | 메서드     | 설명                |
| ------------------------ | ---------- | ------------------- |
| `/products`              | **GET**    | 모든 상품 목록 조회 |
| `/products/:id`          | **GET**    | 특정 상품 조회      |
| `/products`              | **POST**   | 새 상품 등록        |
| `/products/:id`          | **PATCH**  | 특정 상품 정보 수정 |
| `/products/:id`          | **PUT**    | 상품 생성 혹은 수정 |
| `/products/:id`          | **DELETE** | 특정 상품 삭제      |
| `/products/:id/comments` | **GET**    | 상품 댓글 조회      |
| `/products/:id/comments` | **POST**   | 상품 댓글 생성      |

### 게시물 관리 라우트

| 엔드포인트               | 메서드     | 설명                  |
| ------------------------ | ---------- | --------------------- |
| `/articles`              | **GET**    | 모든 게시물 목록 조회 |
| `/articles/:id`          | **GET**    | 특정 게시물 조회      |
| `/articles`              | **POST**   | 새 게시물 등록        |
| `/articles/:id`          | **PATCH**  | 특정 게시물 정보 수정 |
| `/articles/:id`          | **DELETE** | 특정 게시물 삭제      |
| `/articles/:id/comments` | **GET**    | 게시물 댓글 조회      |
| `/articles/:id/comments` | **POST**   | 게시물 댓글 생성      |

### 댓글 관리 라우트

| 엔드포인트      | 메서드     | 설명      |
| --------------- | ---------- | --------- |
| `/comments/:id` | **PATCH**  | 댓글 수정 |
| `/comments/:id` | **DELETE** | 댓글 삭제 |

---

본 프로젝트는 [코드잇](https://www.codeit.kr)의 소유이며, 교육 목적으로만 사용됩니다. © 2026 Codeit. All rights reserved.

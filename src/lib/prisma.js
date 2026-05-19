import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"], // 실행되는 SQL 쿼리를 콘솔에 출력
});

export default prisma;

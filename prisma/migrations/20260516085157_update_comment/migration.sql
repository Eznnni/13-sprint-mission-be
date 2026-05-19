-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "productId" INTEGER,
ALTER COLUMN "articleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_productId_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

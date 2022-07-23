-- AlterTable
ALTER TABLE "User" ALTER COLUMN "displayName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Pat" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patterId" INTEGER NOT NULL,
    "pattedId" INTEGER NOT NULL,

    CONSTRAINT "Pat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StickerSet" (
    "id" SERIAL NOT NULL,
    "setName" TEXT NOT NULL,

    CONSTRAINT "StickerSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StickerSetOnUsers" (
    "timeAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stickerSetId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StickerSetOnUsers_pkey" PRIMARY KEY ("stickerSetId","userId")
);

-- CreateTable
CREATE TABLE "Sticker" (
    "id" SERIAL NOT NULL,
    "file_id" TEXT NOT NULL,
    "stickerSetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StickerCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nsfw" BOOLEAN NOT NULL,

    CONSTRAINT "StickerCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StickerCategoryOnStickers" (
    "stickerId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "StickerCategoryOnStickers_pkey" PRIMARY KEY ("stickerId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StickerSet_setName_key" ON "StickerSet"("setName");

-- CreateIndex
CREATE UNIQUE INDEX "Sticker_file_id_key" ON "Sticker"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "StickerCategory_name_key" ON "StickerCategory"("name");

-- AddForeignKey
ALTER TABLE "Pat" ADD CONSTRAINT "Pat_pattedId_fkey" FOREIGN KEY ("pattedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pat" ADD CONSTRAINT "Pat_patterId_fkey" FOREIGN KEY ("patterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickerSetOnUsers" ADD CONSTRAINT "StickerSetOnUsers_stickerSetId_fkey" FOREIGN KEY ("stickerSetId") REFERENCES "StickerSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickerSetOnUsers" ADD CONSTRAINT "StickerSetOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_stickerSetId_fkey" FOREIGN KEY ("stickerSetId") REFERENCES "StickerSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickerCategoryOnStickers" ADD CONSTRAINT "StickerCategoryOnStickers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "StickerCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickerCategoryOnStickers" ADD CONSTRAINT "StickerCategoryOnStickers_stickerId_fkey" FOREIGN KEY ("stickerId") REFERENCES "Sticker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

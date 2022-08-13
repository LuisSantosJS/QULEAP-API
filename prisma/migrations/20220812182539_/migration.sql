/*
  Warnings:

  - You are about to drop the column `description` on the `UserSongMap` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserSongMap_description_key";

-- AlterTable
ALTER TABLE "UserSongMap" DROP COLUMN "description";

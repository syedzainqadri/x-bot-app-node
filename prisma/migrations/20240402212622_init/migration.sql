/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformName` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raidLink` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedIMGURL` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `platformName` VARCHAR(191) NOT NULL,
    ADD COLUMN `raidLink` VARCHAR(191) NOT NULL,
    ADD COLUMN `tag` VARCHAR(191) NOT NULL,
    ADD COLUMN `uploadedIMGURL` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `User`;

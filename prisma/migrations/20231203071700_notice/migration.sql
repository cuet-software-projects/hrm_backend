/*
  Warnings:

  - You are about to drop the `_recipients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_recipients` DROP FOREIGN KEY `_recipients_A_fkey`;

-- DropForeignKey
ALTER TABLE `_recipients` DROP FOREIGN KEY `_recipients_B_fkey`;

-- DropTable
DROP TABLE `_recipients`;

-- CreateTable
CREATE TABLE `notice_recipients` (
    `id` VARCHAR(191) NOT NULL,
    `noticeId` VARCHAR(191) NOT NULL,
    `recipientId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `notice_recipients_id_key`(`id`),
    UNIQUE INDEX `notice_recipients_noticeId_recipientId_key`(`noticeId`, `recipientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `notices_sender_id_fkey` ON `notices`(`sender_id`);

-- AddForeignKey
ALTER TABLE `notice_recipients` ADD CONSTRAINT `notice_recipients_noticeId_fkey` FOREIGN KEY (`noticeId`) REFERENCES `notices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notice_recipients` ADD CONSTRAINT `notice_recipients_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

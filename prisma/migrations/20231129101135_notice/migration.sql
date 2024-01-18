-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `dob` VARCHAR(191) NULL,
    `fathers_name` VARCHAR(191) NULL,
    `mothers_name` VARCHAR(191) NULL,
    `blood_group` VARCHAR(191) NULL,
    `contact_number` VARCHAR(191) NULL,
    `emergency_contact_number` VARCHAR(191) NULL,
    `nid` VARCHAR(191) NULL,
    `present_address` VARCHAR(191) NULL,
    `permanent_address` VARCHAR(191) NULL,
    `tshirt` ENUM('XS', 'S', 'L', 'XL', 'XXL', 'XXXL') NULL,
    `tin_number` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `password` VARCHAR(191) NOT NULL,
    `marital_status` ENUM('MARRIED', 'SINGLE', 'DIVORCED') NULL DEFAULT 'SINGLE',
    `profile_picture` VARCHAR(191) NULL,
    `religion` ENUM('ISLAM', 'HINDUISM', 'BUDDHISM', 'CHIRSTIANITY') NOT NULL DEFAULT 'ISLAM',
    `current_employee_id` VARCHAR(191) NULL,
    `current_status` ENUM('ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED', 'LEFT') NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `users_id_key`(`id`),
    UNIQUE INDEX `users_userName_key`(`userName`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_nid_key`(`nid`),
    UNIQUE INDEX `users_tin_number_key`(`tin_number`),
    UNIQUE INDEX `users_current_employee_id_key`(`current_employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `roles_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_infos` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `reporting_officer_id` VARCHAR(191) NOT NULL,
    `joined_at` DATETIME(3) NOT NULL,
    `left_at` DATETIME(3) NULL,
    `work_type` ENUM('REMOTE', 'OFFICE') NOT NULL DEFAULT 'OFFICE',
    `branch_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `employee_number` INTEGER NOT NULL,
    `current_designation_id` VARCHAR(191) NULL,
    `current_salary` INTEGER NULL DEFAULT 5000,

    UNIQUE INDEX `employee_infos_id_key`(`id`),
    UNIQUE INDEX `employee_infos_employee_id_key`(`employee_id`),
    INDEX `employee_infos_branch_id_fkey`(`branch_id`),
    INDEX `employee_infos_current_designation_id_fkey`(`current_designation_id`),
    INDEX `employee_infos_department_id_fkey`(`department_id`),
    INDEX `employee_infos_reporting_officer_id_fkey`(`reporting_officer_id`),
    INDEX `employee_infos_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaves` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `started_at` DATETIME(3) NOT NULL,
    `ended_at` DATETIME(3) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `action_taken_by_id` VARCHAR(191) NULL,
    `leave_type` ENUM('CASUAL', 'SICK') NOT NULL,
    `leave_status` ENUM('APPROVED', 'DECLIEND') NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `leaves_id_key`(`id`),
    INDEX `Leave_action_taken_by_id_fkey`(`action_taken_by_id`),
    INDEX `Leave_employee_id_fkey`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payrolls` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `salary` INTEGER NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'IN_PROGRESS', 'ARCHIVE') NOT NULL DEFAULT 'DRAFT',
    `date` DATETIME(3) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `payrolls_id_key`(`id`),
    INDEX `payrolls_employee_id_fkey`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonuses` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `bonus` INTEGER NOT NULL DEFAULT 0,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'IN_PROGRESS', 'ARCHIVE') NOT NULL DEFAULT 'DRAFT',
    `employee_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `bonuses_id_key`(`id`),
    INDEX `bonuses_employee_id_fkey`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_designations_and_salaries` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `designation_id` VARCHAR(191) NOT NULL,
    `salary` INTEGER NOT NULL DEFAULT 5000,
    `reason` ENUM('JOINING', 'PERMANENT', 'PERFORMANCE_PROMOTION', 'PERFORMANCE_DEMOTION', 'EXPERIENCE_PROMOTION', 'REVISED') NOT NULL DEFAULT 'JOINING',

    UNIQUE INDEX `employee_designations_and_salaries_id_key`(`id`),
    INDEX `employee_designations_and_salaries_designation_id_fkey`(`designation_id`),
    INDEX `employee_designations_and_salaries_employee_id_fkey`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `designations` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `designations_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,

    INDEX `user_roles_user_id_role_id_idx`(`user_id`, `role_id`),
    INDEX `user_roles_role_id_fkey`(`role_id`),
    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `prefix_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `departments_id_key`(`id`),
    UNIQUE INDEX `departments_code_key`(`code`),
    UNIQUE INDEX `departments_prefix_code_key`(`prefix_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `teams_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,

    UNIQUE INDEX `branches_id_key`(`id`),
    UNIQUE INDEX `branches_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendences` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `entry_time` VARCHAR(191) NOT NULL,
    `exit_time` VARCHAR(191) NULL,
    `work_descriptions` TEXT NULL,
    `work_type` ENUM('REMOTE', 'OFFICE') NOT NULL DEFAULT 'OFFICE',
    `markings` DOUBLE NULL,
    `break_duration` DOUBLE NULL,
    `reason_of_break` TEXT NULL,
    `work_plan` TEXT NULL,

    UNIQUE INDEX `attendences_id_key`(`id`),
    UNIQUE INDEX `attendences_employee_id_date_key`(`employee_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_notification_preferences` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `email` BOOLEAN NOT NULL DEFAULT true,
    `sms` BOOLEAN NOT NULL DEFAULT true,
    `db_notification` BOOLEAN NOT NULL DEFAULT true,
    `push_notification` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `user_notification_preferences_id_key`(`id`),
    UNIQUE INDEX `user_notification_preferences_user_id_key`(`user_id`),
    INDEX `user_notification_preferences_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_assosciations` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('USER', 'EMPLOYEE', 'DILIGITE') NOT NULL DEFAULT 'DILIGITE',
    `type_id` VARCHAR(191) NULL,
    `document_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `document_assosciations_id_key`(`id`),
    INDEX `document_assosciations_document_id_fkey`(`document_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `document_name` VARCHAR(191) NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `notice_id` VARCHAR(191) NULL,

    UNIQUE INDEX `documents_id_key`(`id`),
    UNIQUE INDEX `documents_file_path_key`(`file_path`),
    INDEX `documents_document_name_mime_type_idx`(`document_name`, `mime_type`),
    INDEX `documents_notice_id_fkey`(`notice_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbacks` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `feedback_type` ENUM('BUG', 'FEATURE') NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `feedbacks_id_key`(`id`),
    INDEX `feedbacks_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `issue_date` DATETIME(3) NOT NULL,
    `invoice_subject` VARCHAR(191) NOT NULL,
    `invoice_items` JSON NOT NULL,
    `sub_total` DOUBLE NOT NULL,
    `tax_percentage` DOUBLE NOT NULL DEFAULT 15,
    `discount` DOUBLE NULL,
    `total` DOUBLE NOT NULL,
    `note` TEXT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'IN_PROGRESS', 'ARCHIVE', 'PARTIALLY_PAID', 'PAID') NOT NULL DEFAULT 'DRAFT',
    `amount_paid` DOUBLE NULL,
    `due_date` DATETIME(3) NOT NULL,
    `parent_invoice_id` VARCHAR(191) NULL,
    `received_by_id` VARCHAR(191) NULL,

    UNIQUE INDEX `invoices_id_key`(`id`),
    INDEX `invoices_parent_invoice_id_fkey`(`parent_invoice_id`),
    INDEX `invoices_received_by_id_fkey`(`received_by_id`),
    INDEX `invoices_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billing_infos` (
    `id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    `address_line_1` VARCHAR(191) NOT NULL,
    `address_line_2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `zip_code` VARCHAR(191) NULL,

    UNIQUE INDEX `billing_infos_id_key`(`id`),
    UNIQUE INDEX `billing_infos_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salary_certificates` (
    `id` VARCHAR(191) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    `current_salary` INTEGER NOT NULL,
    `current_designation` VARCHAR(191) NOT NULL,
    `issue_date` DATETIME(3) NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('APPROVED', 'DECLINED') NULL,

    UNIQUE INDEX `salary_certificates_id_key`(`id`),
    UNIQUE INDEX `salary_certificates_user_id_key`(`user_id`),
    INDEX `salary_certificates_user_id_issue_date_current_designation_idx`(`user_id`, `issue_date`, `current_designation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_social_medias` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `facebook` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,

    UNIQUE INDEX `user_social_medias_id_key`(`id`),
    UNIQUE INDEX `user_social_medias_user_id_key`(`user_id`),
    INDEX `user_social_medias_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notices` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sender_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `notices_id_key`(`id`),
    UNIQUE INDEX `notices_sender_id_key`(`sender_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EmployeeTeam` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EmployeeTeam_AB_unique`(`A`, `B`),
    INDEX `_EmployeeTeam_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_recipients` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_recipients_AB_unique`(`A`, `B`),
    INDEX `_recipients_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_current_employee_id_fkey` FOREIGN KEY (`current_employee_id`) REFERENCES `employee_infos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_infos` ADD CONSTRAINT `employee_infos_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_infos` ADD CONSTRAINT `employee_infos_current_designation_id_fkey` FOREIGN KEY (`current_designation_id`) REFERENCES `designations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_infos` ADD CONSTRAINT `employee_infos_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_infos` ADD CONSTRAINT `employee_infos_reporting_officer_id_fkey` FOREIGN KEY (`reporting_officer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_infos` ADD CONSTRAINT `employee_infos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_action_taken_by_id_fkey` FOREIGN KEY (`action_taken_by_id`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payrolls` ADD CONSTRAINT `payrolls_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_designations_and_salaries` ADD CONSTRAINT `employee_designations_and_salaries_designation_id_fkey` FOREIGN KEY (`designation_id`) REFERENCES `designations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_designations_and_salaries` ADD CONSTRAINT `employee_designations_and_salaries_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendences` ADD CONSTRAINT `attendences_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notification_preferences` ADD CONSTRAINT `user_notification_preferences_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_assosciations` ADD CONSTRAINT `document_assosciations_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_notice_id_fkey` FOREIGN KEY (`notice_id`) REFERENCES `notices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_parent_invoice_id_fkey` FOREIGN KEY (`parent_invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_received_by_id_fkey` FOREIGN KEY (`received_by_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `billing_infos` ADD CONSTRAINT `billing_infos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salary_certificates` ADD CONSTRAINT `salary_certificates_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_social_medias` ADD CONSTRAINT `user_social_medias_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notices` ADD CONSTRAINT `notices_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmployeeTeam` ADD CONSTRAINT `_EmployeeTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `employee_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmployeeTeam` ADD CONSTRAINT `_EmployeeTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_recipients` ADD CONSTRAINT `_recipients_A_fkey` FOREIGN KEY (`A`) REFERENCES `notices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_recipients` ADD CONSTRAINT `_recipients_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

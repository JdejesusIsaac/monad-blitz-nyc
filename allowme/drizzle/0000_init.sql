CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `treasury` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet_name` text NOT NULL,
	`address` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`name` text NOT NULL,
	`reward_amount_usdc` text NOT NULL,
	`daily_cap_usdc` text NOT NULL,
	`course_slug` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`learner_wallet` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enrollments_program_learner_idx` ON `enrollments` (`program_id`,`learner_id`);--> statement-breakpoint
CREATE TABLE `completions` (
	`id` text PRIMARY KEY NOT NULL,
	`enrollment_id` text NOT NULL,
	`score` integer NOT NULL,
	`verified` integer NOT NULL,
	`verified_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`learner_wallet` text NOT NULL,
	`amount_usdc` text NOT NULL,
	`tx_hash` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payouts_program_learner_idx` ON `payouts` (`program_id`,`learner_id`);

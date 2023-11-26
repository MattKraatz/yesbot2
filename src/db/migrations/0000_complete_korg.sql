CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`has_attachment` integer NOT NULL,
	`created_at` integer NOT NULL
);

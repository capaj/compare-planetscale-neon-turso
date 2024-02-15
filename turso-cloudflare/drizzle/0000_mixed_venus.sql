CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

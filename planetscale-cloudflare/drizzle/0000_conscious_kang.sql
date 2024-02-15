CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);

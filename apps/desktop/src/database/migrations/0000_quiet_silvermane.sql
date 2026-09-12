CREATE TABLE `apps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`version` text,
	`path` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `windows` (
	`id` text PRIMARY KEY NOT NULL,
	`app_id` text NOT NULL,
	`x` integer,
	`y` integer,
	`width` integer,
	`height` integer,
	`maximized` integer DEFAULT false,
	`minimized` integer DEFAULT false
);

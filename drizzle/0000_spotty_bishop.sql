CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`experience` text,
	`studio` text,
	`date` text,
	`time` text,
	`participants` integer,
	`slot_id` text,
	`message` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`staff_note` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `requests_created` ON `requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `requests_slot` ON `requests` (`slot_id`,`status`);--> statement-breakpoint
CREATE TABLE `slots` (
	`id` text PRIMARY KEY NOT NULL,
	`experience` text NOT NULL,
	`studio` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`end_time` text NOT NULL,
	`capacity` integer NOT NULL,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `slots_lookup` ON `slots` (`studio`,`date`);--> statement-breakpoint
CREATE TRIGGER slots_no_overlap BEFORE INSERT ON slots
WHEN NEW.active=1 AND EXISTS (SELECT 1 FROM slots WHERE studio=NEW.studio AND date=NEW.date AND (active=1 OR EXISTS(SELECT 1 FROM requests WHERE slot_id=slots.id AND status='confirmed')) AND time<NEW.end_time AND end_time>NEW.time)
BEGIN SELECT RAISE(ABORT, 'session overlap'); END;
--> statement-breakpoint
CREATE TRIGGER slots_reopen_no_overlap BEFORE UPDATE OF active ON slots
WHEN NEW.active=1 AND EXISTS (SELECT 1 FROM slots WHERE id<>NEW.id AND studio=NEW.studio AND date=NEW.date AND (active=1 OR EXISTS(SELECT 1 FROM requests WHERE slot_id=slots.id AND status='confirmed')) AND time<NEW.end_time AND end_time>NEW.time)
BEGIN SELECT RAISE(ABORT, 'session overlap'); END;
--> statement-breakpoint
CREATE TRIGGER slots_capacity_check BEFORE UPDATE OF capacity ON slots
WHEN NEW.capacity < COALESCE((SELECT SUM(participants) FROM requests WHERE slot_id=NEW.id AND status='confirmed'),0)
BEGIN SELECT RAISE(ABORT, 'confirmed reservations exceed capacity'); END;
--> statement-breakpoint
CREATE TRIGGER slots_protect_confirmed BEFORE UPDATE ON slots
WHEN EXISTS (SELECT 1 FROM requests WHERE slot_id=OLD.id AND status='confirmed') AND (NEW.date<>OLD.date OR NEW.time<>OLD.time OR NEW.end_time<>OLD.end_time OR NEW.studio<>OLD.studio OR NEW.experience<>OLD.experience)
BEGIN SELECT RAISE(ABORT, 'confirmed session cannot move'); END;
--> statement-breakpoint
CREATE TRIGGER booking_confirm_capacity BEFORE UPDATE ON requests
WHEN NEW.status='confirmed'
BEGIN
 SELECT CASE WHEN NEW.kind<>'booking' OR NEW.participants IS NULL OR NEW.participants<1 OR NEW.participants>50 OR NOT EXISTS(SELECT 1 FROM slots WHERE id=NEW.slot_id AND active=1) THEN RAISE(ABORT, 'inactive or invalid session') END;
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM slots WHERE id=NEW.slot_id AND studio=NEW.studio AND experience=NEW.experience AND date=NEW.date AND time=NEW.time) THEN RAISE(ABORT, 'session mismatch') END;
 SELECT CASE WHEN NEW.participants+COALESCE((SELECT SUM(participants) FROM requests WHERE slot_id=NEW.slot_id AND status='confirmed' AND id<>NEW.id),0)>(SELECT capacity FROM slots WHERE id=NEW.slot_id) THEN RAISE(ABORT, 'session capacity exceeded') END;
END;
--> statement-breakpoint
CREATE TRIGGER booking_insert_pending BEFORE INSERT ON requests
WHEN NEW.status<>'pending'
BEGIN SELECT RAISE(ABORT, 'new requests must be pending'); END;

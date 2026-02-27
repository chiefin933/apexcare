CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`doctorName` varchar(255) NOT NULL,
	`department` varchar(255) NOT NULL,
	`appointmentDate` varchar(50) NOT NULL,
	`appointmentTime` varchar(20) NOT NULL,
	`patientFirstName` varchar(255) NOT NULL,
	`patientLastName` varchar(255) NOT NULL,
	`patientEmail` varchar(320) NOT NULL,
	`patientPhone` varchar(20) NOT NULL,
	`reasonForVisit` text,
	`insuranceProvider` varchar(255),
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`consultationFee` decimal(10,2) DEFAULT '0',
	`paymentStatus` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`paymentMethod` enum('stripe','mpesa','none') NOT NULL DEFAULT 'none',
	`stripePaymentIntentId` varchar(255),
	`mpesaCheckoutRequestId` varchar(255),
	`emailSent` boolean NOT NULL DEFAULT false,
	`confirmationEmailSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int,
	`userId` int,
	`recipientEmail` varchar(320) NOT NULL,
	`emailType` enum('appointment_confirmation','appointment_reminder','payment_receipt','payment_failed','appointment_cancelled') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`status` enum('sent','failed','bounced') NOT NULL DEFAULT 'sent',
	`errorMessage` text,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mpesaPayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'KES',
	`phoneNumber` varchar(20) NOT NULL,
	`checkoutRequestId` varchar(255) NOT NULL,
	`requestId` varchar(255),
	`resultCode` varchar(10),
	`resultDesc` text,
	`mpesaReceiptNumber` varchar(50),
	`transactionDate` varchar(20),
	`status` enum('pending','succeeded','failed','timeout') NOT NULL DEFAULT 'pending',
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mpesaPayments_id` PRIMARY KEY(`id`),
	CONSTRAINT `mpesaPayments_checkoutRequestId_unique` UNIQUE(`checkoutRequestId`)
);
--> statement-breakpoint
CREATE TABLE `stripePayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`status` enum('pending','succeeded','failed','canceled') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`receiptUrl` text,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripePayments_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripePayments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);

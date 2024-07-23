CREATE TABLE IF NOT EXISTS "address" (
	"id" text PRIMARY KEY NOT NULL,
	"address" varchar(100),
	"city" varchar(20),
	"state" varchar(20),
	"zip_code" numeric(5, 0),
	"country" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_phone_number_unique";--> statement-breakpoint
ALTER TABLE "insurance" DROP CONSTRAINT "insurance_patient_id_encounter_id_fk";
--> statement-breakpoint
ALTER TABLE "insurance" ADD COLUMN "encounter_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "phone_number" numeric(10);--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "address_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance" ADD CONSTRAINT "insurance_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance" ADD CONSTRAINT "insurance_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient" ADD CONSTRAINT "patient_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "phone_number";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "state";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "zip_code";--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_phone_number_unique" UNIQUE("phone_number");
DO $$ BEGIN
 CREATE TYPE "public"."blood_types" AS ENUM('A positive', 'A negative', 'B positive', 'B negative', 'AB positive', 'AB negative', 'O positive', 'O negative');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."marital_status" AS ENUM('Married', 'Single', 'Divorced', 'Widowed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."preferred_language" AS ENUM('English', 'Spanish', 'Vietnamese', 'Mandarin', 'Portuguese');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "patient" ALTER COLUMN "blood_type" SET DATA TYPE blood_types USING blood_type::blood_types;;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "marital_status" "marital_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "preferred_language" "preferred_language" DEFAULT 'English' NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "language";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "allergies";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "medications";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "insurance_provider";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "insurance_policy_number";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "last_appointment";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "next_appointment_date";

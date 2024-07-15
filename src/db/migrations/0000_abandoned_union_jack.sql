DO $$ BEGIN
 CREATE TYPE "public"."appointment_type" AS ENUM('new_patient', 'follow_up', 'annual_physical');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'cancelled', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."encounter_type" AS ENUM('inpatient', 'outpatient', 'emergency');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."med_route" AS ENUM('oral', 'IV');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."med_status" AS ENUM('active', 'Inactive', 'suspended', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."severity" AS ENUM('mild', 'moderate', 'severe');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."blood_types" AS ENUM('A positive', 'A negative', 'B positive', 'B negative', 'AB positive', 'AB negative', 'O positive', 'O negative');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."lab_status" AS ENUM('pending', 'completed', 'cancelled');
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
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('patient', 'admin', 'provider');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "allergy" (
	"id" text PRIMARY KEY NOT NULL,
	"encounter_id" text NOT NULL,
	"allergen" varchar(100),
	"allergy_reaction" varchar(100),
	"severity" "severity" NOT NULL,
	"note" varchar(2000),
	"updated_At" date NOT NULL,
	"created_At" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointment" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"scheduled_date" date,
	"scheduled_time" time,
	"location" varchar(50),
	"appointment_type" "appointment_type",
	"appointment_status" "appointment_status" DEFAULT 'scheduled' NOT NULL,
	"notes" varchar(500)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "diagnosis" (
	"id" text PRIMARY KEY NOT NULL,
	"diagnosis_name" varchar(50) NOT NULL,
	"diagnosis_code" varchar(50) NOT NULL,
	"encounter_id" text NOT NULL,
	"severity" "severity" NOT NULL,
	"description" varchar(2000),
	"updated_At" date NOT NULL,
	"created_At" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "encounter" (
	"id" text PRIMARY KEY NOT NULL,
	"appointment_id" text NOT NULL,
	"date" date,
	"time" time,
	"encounter_type" "encounter_type" DEFAULT 'outpatient' NOT NULL,
	"chief_complaint" varchar(2000),
	"assessment_and_plan" text,
	"notes" varchar(2000),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "immunization" (
	"id" text PRIMARY KEY NOT NULL,
	"vaccine_name" varchar(100) NOT NULL,
	"site" text NOT NULL,
	"date_administered" date NOT NULL,
	"time_administered" time NOT NULL,
	"encounter_id" text NOT NULL,
	"administrator" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"company_name" varchar NOT NULL,
	"policy_number" varchar,
	"group_number" varchar,
	"phone_number" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labs" (
	"id" text PRIMARY KEY NOT NULL,
	"encounter_id" text NOT NULL,
	"lab_name" varchar(100),
	"testCode" varchar(100),
	"lab_status" "lab_status" DEFAULT 'pending' NOT NULL,
	"comments" varchar(2000),
	"lab_result" varchar(2000),
	"resultDate" date,
	"date_ordered" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medication" (
	"id" text PRIMARY KEY NOT NULL,
	"encounter_id" text NOT NULL,
	"medication_name" varchar(100) NOT NULL,
	"code" varchar(50),
	"dosage" varchar(100),
	"frequency" varchar(100),
	"med_route" "med_route" NOT NULL,
	"med_status" "med_status" NOT NULL,
	"note" varchar(100),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"height" numeric(3, 2) NOT NULL,
	"weight" numeric(3) NOT NULL,
	"occupation" varchar(50) NOT NULL,
	"marital_status" "marital_status" NOT NULL,
	"emergency_contact_name" varchar(50) NOT NULL,
	"emergency_contact_relationship" varchar(50) NOT NULL,
	"emergency_contact_number" numeric(10) NOT NULL,
	"social_history" varchar(2000),
	"past_surgeries" varchar(2000),
	"family_history" varchar(2000),
	"blood_type" "blood_types" NOT NULL,
	"provider_id" text NOT NULL,
	"preferred_language" "preferred_language" DEFAULT 'English' NOT NULL,
	" created_at" timestamp DEFAULT now() NOT NULL,
	"notes" varchar(2000)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "procedure" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_name" varchar NOT NULL,
	"procedure_description" varchar,
	"procedure_cost" numeric NOT NULL,
	"procedure_duration" time NOT NULL,
	"procedure_date" date NOT NULL,
	"encounter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_patient" (
	"patient_id" text NOT NULL,
	"provider_id" text NOT NULL,
	CONSTRAINT "provider_patient_patient_id_provider_id_pk" PRIMARY KEY("patient_id","provider_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"specialty" varchar(2000),
	"license_number" varchar(20),
	"provider_qualification" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"gender" "gender" NOT NULL,
	"date" date,
	"phone_number" numeric(10),
	"email" varchar(30) NOT NULL,
	"emailVerified" timestamp,
	"role" "role" DEFAULT 'patient' NOT NULL,
	"address" varchar(100),
	"city" varchar(20),
	"state" varchar(20),
	"zip_code" numeric(5, 0),
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vital_signs" (
	"id" text PRIMARY KEY NOT NULL,
	"encounter_id" text NOT NULL,
	"height" numeric(3, 2) NOT NULL,
	"weight" numeric(3) NOT NULL,
	"systolic_pressure" numeric(5, 2) NOT NULL,
	"diastolic_pressure" numeric(5, 2) NOT NULL,
	"heart_rate" numeric(5, 2) NOT NULL,
	"body_temperature" numeric(5, 2) NOT NULL,
	"respiratory_rate" numeric(5, 2) NOT NULL,
	"oxygen_saturation" numeric(5, 2) NOT NULL,
	"bmi" numeric(5, 2) NOT NULL,
	"measured_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "allergy" ADD CONSTRAINT "allergy_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointment" ADD CONSTRAINT "appointment_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diagnosis" ADD CONSTRAINT "diagnosis_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounter" ADD CONSTRAINT "encounter_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "immunization" ADD CONSTRAINT "immunization_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance" ADD CONSTRAINT "insurance_patient_id_encounter_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labs" ADD CONSTRAINT "labs_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medication" ADD CONSTRAINT "medication_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient" ADD CONSTRAINT "patient_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "procedure" ADD CONSTRAINT "procedure_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_patient" ADD CONSTRAINT "provider_patient_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_patient" ADD CONSTRAINT "provider_patient_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider" ADD CONSTRAINT "provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_encounter_id_encounter_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "public"."encounter"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "allergiesIndex" ON "allergy" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "appointmentIndex" ON "appointment" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "diagnosisIndex" ON "diagnosis" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "encounterIndex" ON "encounter" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "immunizationIndex" ON "immunization" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "insuranceIndex" ON "insurance" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "labsIndex" ON "labs" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "medicationsIndex" ON "medication" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "patientIndex" ON "patient" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "proceduresIndex" ON "procedure" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "providerIndex" ON "provider" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users__email__idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "encounter__id__idx" ON "vital_signs" USING btree ("encounter_id");
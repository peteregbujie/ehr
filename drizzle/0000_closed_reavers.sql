DO $$ BEGIN
 CREATE TYPE "bloodType" AS ENUM('A positive', 'A negative', 'B positive', 'B negative', 'AB positive', 'AB negative', 'O positive', 'O negative');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "encounterenum" AS ENUM('inpatient', 'outpatient', 'emergency');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "preferredLanguage" AS ENUM('English', 'Spanish', 'Vietnamese', 'Mandarin', 'Portuguese', '');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "userrole" AS ENUM('admin', 'patient', 'doctor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "allergy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"allergen" varchar(100),
	"allergy_reaction" varchar(100),
	"allergy_date" date NOT NULL,
	"allergy_time" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"dateandtime" timestamp DEFAULT now() NOT NULL,
	"reason_for_visit" varchar(100),
	"notes" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "diagnosis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"diagnosis_code" varchar NOT NULL,
	"description" varchar,
	"encounter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctorspatients" (
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	CONSTRAINT "doctorspatients_patient_id_doctor_id_pk" PRIMARY KEY("patient_id","doctor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"specialty" varchar(2000),
	"license_number" varchar(20),
	"appointment_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "encounterDB" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"dateandtime" timestamp DEFAULT now() NOT NULL,
	"encounterenum" "encounterenum" DEFAULT 'inpatient' NOT NULL,
	"chief_complaint" varchar(256),
	"varchar2" varchar(256),
	"physical_exam" varchar(256),
	"assessment_and_plan" varchar(2000),
	"notes" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "immunization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"vaccine_name" varchar(100) NOT NULL,
	"date_administered" date NOT NULL,
	"time_administered" time NOT NULL,
	"encounter_id" uuid NOT NULL,
	"administrator" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"company_name" varchar NOT NULL,
	"policy_number" varchar,
	"group_number" varchar,
	"phone_number" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"specialty" varchar(2000),
	"license_number" varchar(20),
	"lab_name" varchar(100),
	"lab_result" varchar(2000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"encounter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medication" (
	"id:" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"medication_name" varchar(100) NOT NULL,
	"dosage" varchar(100),
	"frequency" varchar(100),
	"encounter_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"emergency_contact_name" varchar(50) NOT NULL,
	"emergency_contact_relationship" varchar(50) NOT NULL,
	"emergency_contact_number" numeric(10) NOT NULL,
	"bloodType" "bloodType" DEFAULT 'A positive' NOT NULL,
	"height" numeric(1, 2) NOT NULL,
	"weight" numeric(3) NOT NULL,
	"occupation" varchar(50) NOT NULL,
	"primary_care_physician" varchar(50) NOT NULL,
	"insurance_provider" varchar(50) NOT NULL,
	"insurance_policy_number" varchar(50) NOT NULL,
	"preferredLanguage" "preferredLanguage" DEFAULT 'English' NOT NULL,
	" created_at" timestamp DEFAULT now() NOT NULL,
	"last_appointment" date NOT NULL,
	"next_appointment_date" date NOT NULL,
	"notes" varchar(2000)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "procedure" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"procedure_name" varchar NOT NULL,
	"procedure_description" varchar,
	"procedure_cost" numeric NOT NULL,
	"procedure_duration" time NOT NULL,
	"procedure_date" date NOT NULL,
	"encounter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100),
	"gender" "gender" DEFAULT 'male' NOT NULL,
	"date" date,
	"email" varchar(256) NOT NULL,
	"emailVerified" timestamp,
	"address" varchar(100),
	"city" varchar(20),
	"state" varchar(20),
	"zip_code" numeric(5),
	"image" text,
	"userrole" "userrole" DEFAULT 'patient' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" uuid NOT NULL,
	"refresh_token" uuid,
	"access_token" uuid,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" uuid,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "allergiesIndex" ON "allergy" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "appointmentIndex" ON "appointment" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "diagnosisIndex" ON "diagnosis" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "doctorIndex" ON "doctor" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "encounterIndex" ON "encounterDB" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "immunizationIndex" ON "immunization" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "insuranceIndex" ON "insurance" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "labsIndex" ON "labs" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "medicationsIndex" ON "medication" ("id:");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "patientIndex" ON "patient" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "proceduresIndex" ON "procedure" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users__email__idx" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "allergy" ADD CONSTRAINT "allergy_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diagnosis" ADD CONSTRAINT "diagnosis_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diagnosis" ADD CONSTRAINT "diagnosis_encounter_id_encounterDB_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "encounterDB"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctorspatients" ADD CONSTRAINT "doctorspatients_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctorspatients" ADD CONSTRAINT "doctorspatients_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor" ADD CONSTRAINT "doctor_appointment_id_appointment_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounterDB" ADD CONSTRAINT "encounterDB_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "encounterDB" ADD CONSTRAINT "encounterDB_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "immunization" ADD CONSTRAINT "immunization_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "immunization" ADD CONSTRAINT "immunization_encounter_id_encounterDB_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "encounterDB"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance" ADD CONSTRAINT "insurance_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labs" ADD CONSTRAINT "labs_patient_id_user_id_fk" FOREIGN KEY ("patient_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labs" ADD CONSTRAINT "labs_encounter_id_encounterDB_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "encounterDB"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medication" ADD CONSTRAINT "medication_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medication" ADD CONSTRAINT "medication_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medication" ADD CONSTRAINT "medication_encounter_id_encounterDB_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "encounterDB"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient" ADD CONSTRAINT "patient_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "procedure" ADD CONSTRAINT "procedure_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "procedure" ADD CONSTRAINT "procedure_encounter_id_encounterDB_id_fk" FOREIGN KEY ("encounter_id") REFERENCES "encounterDB"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

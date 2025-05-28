
DO $$
BEGIN
    -- Create user_role type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('ADMIN', 'HR');
    END IF;

    -- Create frequency_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'frequency_type') THEN
        CREATE TYPE frequency_type AS ENUM ('MONTHLY', 'SPECIAL');
    END IF;

    -- Create payslip_status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payslip_status') THEN
        CREATE TYPE payslip_status AS ENUM ('DRAFT', 'PROCESSED', 'PAID');
    END IF;

    -- Create direction if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'direction') THEN
        CREATE TYPE direction AS ENUM ('ADDITION', 'DEDUCTION');
    END IF;
END
$$;


CREATE TABLE IF NOT EXISTS "additions" (
	"id" serial PRIMARY KEY NOT NULL,
	"addition_type_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addition_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"frequency_type" "frequency_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deductions" (
	"id" serial PRIMARY KEY NOT NULL,
	"deduction_type_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deduction_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"frequency_type" "frequency_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(15),
	"position" varchar(50),
	"department" varchar(50),
	"location" varchar(50),
	"basic_salary" numeric(10, 2) NOT NULL,
	"hour_rate" numeric(10, 2),
	"hire_date" date,
	"termination_date" date,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payslips" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"pay_period_start" date NOT NULL,
	"pay_period_end" date NOT NULL,
	"payslip_status" "payslip_status" NOT NULL,
	"basic_salary" numeric NOT NULL,
	"total_additions" numeric NOT NULL,
	"total_deductions" numeric NOT NULL,
	"net_salary" numeric NOT NULL,
	"employee_name" varchar(100) NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"company_address" varchar NOT NULL,
	"company_logo" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payslip_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"payslip_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"description" varchar,
	"direction" "direction" NOT NULL,
	"amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50),
	"email" varchar(100) NOT NULL,
	"password" varchar NOT NULL,
	"user_role" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "additions" ADD CONSTRAINT "additions_addition_type_id_addition_types_id_fk" FOREIGN KEY ("addition_type_id") REFERENCES "public"."addition_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "additions" ADD CONSTRAINT "additions_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deductions" ADD CONSTRAINT "deductions_deduction_type_id_deduction_types_id_fk" FOREIGN KEY ("deduction_type_id") REFERENCES "public"."deduction_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deductions" ADD CONSTRAINT "deductions_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payslip_items" ADD CONSTRAINT "payslip_items_payslip_id_payslips_id_fk" FOREIGN KEY ("payslip_id") REFERENCES "public"."payslips"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_idx" ON "users" USING btree ("email");
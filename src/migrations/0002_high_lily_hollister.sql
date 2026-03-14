CREATE TYPE "public"."borrow_status" AS ENUM('BORROWED', 'RETURNED', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "public"."copy_status" AS ENUM('AVAILABLE', 'BORROWED', 'LOST', 'DAMAGED');--> statement-breakpoint
CREATE TABLE "author" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "author_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "book_authors" (
	"book_id" text NOT NULL,
	"author_id" text NOT NULL,
	CONSTRAINT "book_authors_book_id_author_id_pk" PRIMARY KEY("book_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "book_copies" (
	"id" text PRIMARY KEY NOT NULL,
	"book_id" text NOT NULL,
	"barcode" text NOT NULL,
	"status" "copy_status" DEFAULT 'AVAILABLE'
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isbn" text,
	"description" text,
	"publisher" text,
	"published_year" integer,
	"category_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "borrow_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"copy_id" text NOT NULL,
	"borrow_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"return_date" timestamp,
	"status" "borrow_status" DEFAULT 'BORROWED'
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_id_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_copies" ADD CONSTRAINT "book_copies_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_transactions" ADD CONSTRAINT "borrow_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_transactions" ADD CONSTRAINT "borrow_transactions_copy_id_book_copies_id_fk" FOREIGN KEY ("copy_id") REFERENCES "public"."book_copies"("id") ON DELETE no action ON UPDATE no action;
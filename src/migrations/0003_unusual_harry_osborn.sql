ALTER TABLE "books" ADD COLUMN "is_available" text;--> statement-breakpoint
ALTER TABLE "book_copies" DROP COLUMN "barcode";--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "isbn";
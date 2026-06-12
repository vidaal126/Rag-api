/*
  Warnings:

  - Added the required column `department` to the `document_chunks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `rag_queries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('HR', 'FINANCE');

-- AlterTable
ALTER TABLE "document_chunks" ADD COLUMN     "department" "Department" NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "department" "Department" NOT NULL;

-- AlterTable
ALTER TABLE "rag_queries" ADD COLUMN     "department" "Department" NOT NULL;

-- CreateIndex
CREATE INDEX "document_chunks_department_idx" ON "document_chunks"("department");

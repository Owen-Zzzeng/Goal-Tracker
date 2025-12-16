-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNBEGUN', 'IN_PROGRESS', 'PAUSED', 'COMPLETE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learn" TEXT,
    "have" TEXT,
    "be" TEXT,
    "try" TEXT,
    "see" TEXT,
    "do" TEXT,
    "go" TEXT,
    "create" TEXT,
    "contribute" TEXT,
    "overcome" TEXT,
    "oneDay" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "why" TEXT,
    "expectedCompletionDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'UNBEGUN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'UNBEGUN',

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionStep" (
    "id" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'UNBEGUN',

    CONSTRAINT "ActionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "reachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FutureLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "deliverOn" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "deliveryEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FutureLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuarterlySummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "achievements" TEXT,
    "reflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuarterlySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "QuarterlySummary_userId_year_quarter_key" ON "QuarterlySummary"("userId", "year", "quarter");

-- AddForeignKey
ALTER TABLE "Vision" 
ADD CONSTRAINT "Vision_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" 
ADD CONSTRAINT "Goal_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strategy" 
ADD CONSTRAINT "Strategy_goalId_fkey" 
FOREIGN KEY ("goalId") REFERENCES "Goal"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStep" 
ADD CONSTRAINT "ActionStep_strategyId_fkey" 
FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" 
ADD CONSTRAINT "Milestone_goalId_fkey" 
FOREIGN KEY ("goalId") REFERENCES "Goal"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FutureLetter" 
ADD CONSTRAINT "FutureLetter_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuarterlySummary" 
ADD CONSTRAINT "QuarterlySummary_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

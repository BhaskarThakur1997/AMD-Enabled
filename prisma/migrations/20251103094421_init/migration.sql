-- CreateTable
CREATE TABLE "CallLog" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallLog_pkey" PRIMARY KEY ("id")
);

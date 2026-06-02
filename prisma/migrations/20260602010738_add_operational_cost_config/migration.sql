-- CreateTable
CREATE TABLE "OperationalCostConfig" (
    "id" SERIAL NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "profitMargin" DECIMAL(10,2) NOT NULL,
    "operationalTax" DECIMAL(10,2) NOT NULL,
    "packagingCost" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationalCostConfig_pkey" PRIMARY KEY ("id")
);

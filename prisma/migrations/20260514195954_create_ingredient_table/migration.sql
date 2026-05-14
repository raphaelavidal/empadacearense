-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('G', 'KG', 'ML', 'L', 'UNIT');

-- CreateEnum
CREATE TYPE "NovaClassification" AS ENUM ('NOVA_1', 'NOVA_2', 'NOVA_3', 'NOVA_4');

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "unit" "UnitType" NOT NULL,
    "novaClassification" "NovaClassification" NOT NULL,
    "compositionLabel" TEXT NOT NULL,
    "isNovaVerified" BOOLEAN NOT NULL DEFAULT false,
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "purchaseQuantity" DECIMAL(10,2) NOT NULL,
    "calories" DECIMAL(10,2),
    "proteins" DECIMAL(10,2),
    "carbs" DECIMAL(10,2),
    "fats" DECIMAL(10,2),
    "fiber" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

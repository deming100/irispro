-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "serviceType" TEXT NOT NULL,
    "productTier" TEXT NOT NULL,
    "carPlate" TEXT NOT NULL,
    "carBrand" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "carType" TEXT NOT NULL,
    "carYear" INTEGER,
    "specialNotes" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotConfig" (
    "id" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL DEFAULT 3,
    "date" TEXT,
    "timeSlot" TEXT NOT NULL,

    CONSTRAINT "SlotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

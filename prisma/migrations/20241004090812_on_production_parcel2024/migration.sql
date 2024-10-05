-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "pickupId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEng" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressEng" TEXT NOT NULL,
    "districe" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postcode" INTEGER NOT NULL,
    "landMark" TEXT,
    "email" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "lon" TEXT NOT NULL,
    "employee" TEXT NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "kerryId" TEXT,
    "shopType" TEXT NOT NULL DEFAULT 'shop',
    "costRate" INTEGER NOT NULL DEFAULT 13,
    "saleRate" INTEGER NOT NULL DEFAULT 30,
    "remember" TEXT,
    "registerDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'used',

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "usr" TEXT NOT NULL,
    "pwd" TEXT NOT NULL,
    "registerDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'used',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "value2" TEXT,
    "status" TEXT NOT NULL DEFAULT 'used',

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingList" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "courierCode" TEXT NOT NULL,
    "courierName" TEXT NOT NULL,
    "parcelData" TEXT NOT NULL,
    "parcelUpdate" TEXT,
    "srvCost" INTEGER NOT NULL,
    "priceCost" INTEGER NOT NULL,
    "priceSale" INTEGER NOT NULL,
    "priceArea" INTEGER NOT NULL,
    "codAmount" INTEGER NOT NULL,
    "codService" INTEGER NOT NULL,
    "bookingTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'booking',

    CONSTRAINT "BookingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressBook" (
    "id" SERIAL NOT NULL,
    "addressID" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "subDistrict" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "remark" TEXT,
    "isBlacklist" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'used',

    CONSTRAINT "AddressBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GetCourier" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "courierCode" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "pickupAddressId" TEXT NOT NULL,
    "ticketPickupId" INTEGER NOT NULL,
    "staffInfoId" TEXT,
    "staffInfoName" TEXT,
    "staffInfoPhone" TEXT,
    "upCountryNote" TEXT,
    "timeoutAtText" TEXT,
    "ticketMessage" TEXT,
    "notice" TEXT,
    "remark" TEXT,
    "getTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GetCourier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "amountHode" INTEGER NOT NULL,
    "amountBonus" INTEGER NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditLog" (
    "id" SERIAL NOT NULL,
    "outTradeNo" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "oldAmount" INTEGER NOT NULL,
    "amout" INTEGER NOT NULL,
    "newAmount" INTEGER NOT NULL,
    "amountType" TEXT NOT NULL,
    "logType" TEXT NOT NULL,
    "msg" TEXT,
    "logTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Subnet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "v4partOne" INTEGER NOT NULL,
    "v4partTwo" INTEGER NOT NULL,
    "v4partThree" INTEGER NOT NULL,
    "colour" TEXT NOT NULL,
    "dhcp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "address" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "subnetId" TEXT NOT NULL,
    CONSTRAINT "Address_subnetId_fkey" FOREIGN KEY ("subnetId") REFERENCES "Subnet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

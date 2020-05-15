# Migration `20200516015756-init`

This migration has been generated at 5/16/2020, 1:57:56 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SELLER');

CREATE TYPE "Permission" AS ENUM ('UPRDATE_PERMISSION', 'ADD_ITEM', 'EDIT_ITEM', 'DELETE_ITEM');

CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'DELIVERED', 'ONHOLD', 'APPROVED', 'ON_THE_WAY');

CREATE TABLE "public"."Seller" (
"Brand" text []  ,"EmailIsVerified" boolean  NOT NULL DEFAULT false,"EmailVarificationHash" text  NOT NULL ,"PasswordResetToken" text  NOT NULL ,"PasswordResetTokenExpiry" Decimal(65,30)  NOT NULL ,"SellerItemsCout" integer  NOT NULL ,"confirmPassword" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"id" text  NOT NULL ,"name" text  NOT NULL ,"password" text  NOT NULL ,"permissions" "Permission"[]  ,"phone" text []  ,"role" "Role" NOT NULL DEFAULT 'SELLER',"sellerIdentification" text  NOT NULL ,"sellerNationality" text  NOT NULL ,"storeName" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"PasswordResetToken" text  NOT NULL ,"PasswordResetTokenExpiry" Decimal(65,30)  NOT NULL ,"avatar" text   DEFAULT 'https://www.freepik.com/free-icon/user-image-with-black-background_751548.htm',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"id" text  NOT NULL ,"likesCount" integer  NOT NULL ,"name" text  NOT NULL ,"password" text  NOT NULL ,"permissions" "Permission"[]  ,"reviewCount" integer  NOT NULL ,"role" "Role" NOT NULL DEFAULT 'USER',"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Item" (
"beforeDiscountPrice" Decimal(65,30)  NOT NULL ,"brand" text  NOT NULL DEFAULT 'No brand Provided',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL DEFAULT 'No Description Provided',"dimensions" text  NOT NULL DEFAULT 'No dimensions Provided',"id" text  NOT NULL ,"likesCount" integer  NOT NULL ,"materials" text  NOT NULL DEFAULT 'No materials Provided',"otherInfo" text   DEFAULT 'No Other Info Provided',"overview" text  NOT NULL DEFAULT 'No Overview Provided',"price" Decimal(65,30)  NOT NULL ,"reviewCount" integer  NOT NULL ,"sellerId" text   ,"stock" integer  NOT NULL DEFAULT 1,"title" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,"videoLink" text   DEFAULT 'No Video Link Provided',"weight" text  NOT NULL DEFAULT 'No weight Provided',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Order" (
"charge" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"status" "OrderStatus"[]  ,"total" integer  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."OrderItem" (
"beforeDiscountPrice" Decimal(65,30)  NOT NULL ,"brand" text  NOT NULL DEFAULT 'No brand Provided',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL DEFAULT 'No Description Provided',"dimensions" text  NOT NULL DEFAULT 'No dimensions Provided',"id" text  NOT NULL ,"materials" text  NOT NULL DEFAULT 'No materials Provided',"otherInfo" text   DEFAULT 'No Other Info Provided',"overview" text  NOT NULL DEFAULT 'No Overview Provided',"price" Decimal(65,30)  NOT NULL ,"stock" integer  NOT NULL DEFAULT 1,"title" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,"videoLink" text   DEFAULT 'No Video Link Provided',"weight" text  NOT NULL DEFAULT 'No weight Provided',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."CartItem" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"quantity" integer  NOT NULL DEFAULT 1,"updatedAt" timestamp(3)  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."ItemImage" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"largeUrl" text   ,"orderItemId" text   ,"updatedAt" timestamp(3)  NOT NULL ,"url" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Address" (
"Lat" Decimal(65,30)  NOT NULL DEFAULT 0,"Lng" Decimal(65,30)  NOT NULL DEFAULT 0,"MaincontactNubmer" text  NOT NULL ,"OthercontactNubmers" text []  ,"additionalInfo" text   ,"address" text  NOT NULL ,"city" text  NOT NULL DEFAULT 'No city Provided',"company" text   DEFAULT 'No company Provided',"country" text  NOT NULL DEFAULT 'No country Provided',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"isPrimary" boolean  NOT NULL DEFAULT false,"message" text   DEFAULT 'No message Provided',"name" text  NOT NULL ,"sellerId" text   ,"state" text  NOT NULL DEFAULT 'No state Provided',"streetAddress1" text   DEFAULT 'No streetAddress1 Provided',"streetAddress2" text   DEFAULT 'No streetAddress2 Provided',"updatedAt" timestamp(3)  NOT NULL ,"userId" text   ,"zipCode" text  NOT NULL DEFAULT 'No zipCode Provided',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Review" (
"authorId" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"rating" Decimal(65,30)  NOT NULL DEFAULT 0,"text" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Like" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"updatedAt" timestamp(3)  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Catagory" (
"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Tags" (
"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Colors" (
"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."OherFeatures" (
"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "Seller.email" ON "public"."Seller"("email")

CREATE UNIQUE INDEX "Seller.sellerIdentification" ON "public"."Seller"("sellerIdentification")

CREATE UNIQUE INDEX "Seller.phone" ON "public"."Seller"("phone")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("sellerId")REFERENCES "public"."Seller"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."CartItem" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."CartItem" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ItemImage" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ItemImage" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Address" ADD FOREIGN KEY ("sellerId")REFERENCES "public"."Seller"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Address" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Review" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Review" ADD FOREIGN KEY ("authorId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Review" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Like" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Catagory" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Catagory" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Tags" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Tags" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Colors" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Colors" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."OherFeatures" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."OherFeatures" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200516015756-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,242 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+enum Role {
+ ADMIN
+  USER
+  SELLER
+}
+
+enum Permission {
+ 
+  UPRDATE_PERMISSION
+  ADD_ITEM
+  EDIT_ITEM
+  DELETE_ITEM
+}
+enum OrderStatus {
+  PENDING
+  DELIVERED
+  ONHOLD
+  APPROVED
+  ON_THE_WAY
+}
+
+model Seller {
+  id                                    String    @default(cuid()) @id
+  name                                  String
+  email                                 String    @unique
+  password                              String
+  confirmPassword                       String
+  storeName                             String
+  sellerNationality                     String
+  sellerIdentification                  String       @unique
+  EmailVarificationHash                 String
+  EmailIsVerified                       Boolean        @default(false)
+  PasswordResetToken                    String
+  PasswordResetTokenExpiry              Float
+  SellerItemsCout                       Int 
+  role                                  Role             @default(SELLER) 
+  phone                                 String[]    @unique
+  PickupLocations                       Address[]   @relation("ItemSeller" )
+  Brand                                 String[]
+  items                                 Item[]        
+  permissions                           Permission[]
+  createdAt                             DateTime  @default(now())
+  updatedAt                             DateTime  @updatedAt
+}
+
+
+model User {
+  id               String    @default(cuid()) @id
+  email            String    @unique
+  avatar           String?   @default("https://www.freepik.com/free-icon/user-image-with-black-background_751548.htm")
+  name String
+  password String
+  PasswordResetToken                    String
+  PasswordResetTokenExpiry              Float
+  role                 Role             @default(USER)
+  address Address[]
+  permissions Permission[]
+  cart CartItem[]
+  likes                Like[]
+  likesCount           Int  
+  itemReview           Review[]
+  reviewCount          Int
+  createdAt        DateTime  @default(now())
+  updatedAt        DateTime  @updatedAt
+}
+
+
+
+model Item {
+  id                   String    @default(cuid()) @id
+  likes                Like[]
+  likesCount           Int  
+  itemReview           Review[]
+  reviewCount          Int
+  images               ItemImage[]
+  catagory             Catagory[]
+  tags                 Tags[]
+  colors               Colors[]
+  oherFeatures         OherFeatures[]  
+  title                String
+  description          String       @default("No Description Provided")
+  overview             String       @default("No Overview Provided")
+  otherInfo            String?      @default("No Other Info Provided")
+  videoLink            String?      @default("No Video Link Provided")
+  brand                String       @default("No brand Provided")
+  weight               String       @default("No weight Provided")
+  dimensions           String       @default("No dimensions Provided")
+  materials            String       @default("No materials Provided")
+  price                Float
+  beforeDiscountPrice  Float
+  stock                Int          @default(1)
+  createdAt            DateTime     @default(now())
+  updatedAt            DateTime     @updatedAt
+}
+model Order {
+  id          String    @default(cuid()) @id
+  item        Item      @relation(fields: [itemId], references: [id])
+  itemId      String
+  total       Int
+  user        User      @relation(fields: [userId], references: [id])
+  userId      String 
+  charge      String
+  status      OrderStatus[] 
+  createdAt   DateTime     @default(now())
+  updatedAt   DateTime     @updatedAt
+}
+
+model OrderItem {
+  id                   String    @default(cuid()) @id
+  likes                Like[]  
+  itemReview           Review[]
+  images               ItemImage[]
+  catagory             Catagory[]
+  tags                 Tags[]
+  colors               Colors[]
+  oherFeatures         OherFeatures[]  
+  title                String
+  description          String       @default("No Description Provided")
+  overview             String       @default("No Overview Provided")
+  otherInfo            String?      @default("No Other Info Provided")
+  videoLink            String?      @default("No Video Link Provided")
+  brand                String       @default("No brand Provided")
+  weight               String       @default("No weight Provided")
+  dimensions           String       @default("No dimensions Provided")
+  materials            String       @default("No materials Provided")
+  price                Float
+  beforeDiscountPrice  Float
+  stock                Int          @default(1)
+  createdAt            DateTime     @default(now())
+  updatedAt            DateTime     @updatedAt
+ 
+}
+
+model CartItem {
+  id          String    @default(cuid()) @id
+  quantity    Int       @default(1)
+  item        Item      @relation(fields: [itemId], references: [id])
+  itemId      String
+  user        User      @relation(fields: [userId], references: [id])
+  userId      String 
+  createdAt   DateTime  @default(now())
+  updatedAt   DateTime  @updatedAt
+}
+
+model ItemImage {
+    id        String    @default(cuid()) @id
+    url       String
+    largeUrl  String?    
+    item      Item     @relation(fields: [itemId], references: [id])
+    itemId    String
+    createdAt DateTime @default(now())
+    updatedAt DateTime @updatedAt
+}
+
+
+
+
+
+model Address {
+    id                   String   @default(cuid()) @id
+    name                 String
+    address              String
+    country              String   @default("No country Provided")
+    state                String   @default("No state Provided")
+    city                 String   @default("No city Provided")
+    streetAddress1       String?  @default("No streetAddress1 Provided")
+    streetAddress2       String?  @default("No streetAddress2 Provided")
+    zipCode              String   @default("No zipCode Provided")
+    company              String?  @default("No company Provided")
+    message              String?  @default("No message Provided")
+    additionalInfo       String?
+    MaincontactNubmer    String
+    OthercontactNubmers  String[]
+    isPrimary            Boolean   @default(false)
+    Lat                  Float     @default( 0)
+    Lng                  Float     @default( 0)
+    createdAt            DateTime  @default(now())
+    updatedAt            DateTime  @updatedAt
+}
+
+
+
+model Review {
+  id           String   @default(cuid()) @id
+  item         Item     @relation(fields: [itemId], references: [id])
+  itemId       String   
+  author       User     @relation(fields: [authorId], references: [id])
+  authorId     String     
+  rating       Float    @default(0)
+  text         String
+  createdAt    DateTime  @default(now())
+  updatedAt    DateTime  @updatedAt
+}
+
+
+
+model Like {
+  id        String   @default(cuid()) @id
+  user      User     @relation(fields: [userId], references: [id])
+  userId    String
+  item      Item     @relation(fields: [itemId], references: [id])
+  itemId    String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
+
+
+
+model Catagory {
+  id                   String   @default(cuid()) @id
+  text       String
+  item      Item     @relation(fields: [itemId], references: [id])
+  itemId    String
+
+}
+model Tags {
+   id                   String   @default(cuid()) @id
+  text       String
+  item      Item     @relation(fields: [itemId], references: [id])
+  itemId    String
+}
+model Colors {
+  id                   String   @default(cuid()) @id
+  text       String
+  item      Item     @relation(fields: [itemId], references: [id])
+  itemId    String
+}
+model OherFeatures {
+  id                   String   @default(cuid()) @id
+  text       String
+  item      Item     @relation(fields: [itemId], references: [id])
+  itemId    String
+}
```



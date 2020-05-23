# Migration `20200523200157-init`

This migration has been generated at 5/23/2020, 8:01:59 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Seller" (
"Brand" text []  ,"EmailIsVerified" boolean   DEFAULT false,"EmailVarificationHash" text   ,"PasswordResetToken" text   ,"PasswordResetTokenExpiry" Decimal(65,30)   ,"SellerItemsCout" integer   ,"confirmPassword" text   ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"id" text  NOT NULL ,"name" text  NOT NULL ,"password" text  NOT NULL ,"permissions" "Permission"  DEFAULT 'ADD_ITEM',"phone" text []  ,"role" "Role"  DEFAULT 'SELLER',"sellerIdentification" text  NOT NULL ,"sellerNationality" text  NOT NULL ,"storeName" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"PasswordResetToken" text   ,"PasswordResetTokenExpiry" Decimal(65,30)   ,"avatar" text   DEFAULT 'https://image.flaticon.com/icons/png/512/17/17004.png',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"id" text  NOT NULL ,"likesCount" integer   ,"name" text  NOT NULL ,"password" text  NOT NULL ,"permissions" "Permission"  DEFAULT 'NONE',"reviewCount" integer   ,"role" "Role"  DEFAULT 'USER',"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Item" (
"beforeDiscountPrice" Decimal(65,30)  NOT NULL ,"brand" text   DEFAULT 'No brand Provided',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL DEFAULT 'No Description Provided',"dimensions" text   DEFAULT 'No dimensions Provided',"id" text  NOT NULL ,"likesCount" integer   ,"materials" text   DEFAULT 'No materials Provided',"otherInfo" text   DEFAULT 'No Other Info Provided',"overview" text   DEFAULT 'No Overview Provided',"price" Decimal(65,30)  NOT NULL ,"reviewCount" integer   ,"sellerId" text   ,"stock" integer   DEFAULT 1,"title" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,"videoLink" text   DEFAULT 'No Video Link Provided',"weight" text   DEFAULT 'No weight Provided',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Order" (
"charge" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text   ,"status" "OrderStatus" NOT NULL DEFAULT 'PENDING',"total" integer  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."OrderItem" (
"beforeDiscountPrice" Decimal(65,30)  NOT NULL ,"brand" text   DEFAULT 'No brand Provided',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text  NOT NULL DEFAULT 'No Description Provided',"dimensions" text   DEFAULT 'No dimensions Provided',"id" text  NOT NULL ,"materials" text   DEFAULT 'No materials Provided',"otherInfo" text   DEFAULT 'No Other Info Provided',"overview" text   DEFAULT 'No Overview Provided',"price" Decimal(65,30)  NOT NULL ,"stock" integer   DEFAULT 1,"title" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,"videoLink" text   DEFAULT 'No Video Link Provided',"weight" text   DEFAULT 'No weight Provided',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."CartItem" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"quantity" integer  NOT NULL DEFAULT 1,"updatedAt" timestamp(3)  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."ItemImage" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"largeUrl" text   ,"orderItemId" text   ,"updatedAt" timestamp(3)  NOT NULL ,"url" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Address" (
"Lat" Decimal(65,30)   DEFAULT 0,"Lng" Decimal(65,30)   DEFAULT 0,"MaincontactNubmer" text  NOT NULL ,"OthercontactNubmers" text []  ,"additionalInfo" text   ,"address" text  NOT NULL ,"city" text  NOT NULL DEFAULT 'No city Provided',"company" text   DEFAULT 'No company Provided',"country" text  NOT NULL DEFAULT 'No country Provided',"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"isPrimary" boolean   DEFAULT false,"message" text   DEFAULT 'No message Provided',"name" text  NOT NULL ,"sellerId" text   ,"state" text  NOT NULL DEFAULT 'No state Provided',"streetAddress1" text   DEFAULT 'No streetAddress1 Provided',"streetAddress2" text   DEFAULT 'No streetAddress2 Provided',"updatedAt" timestamp(3)  NOT NULL ,"userId" text   ,"zipCode" text  NOT NULL DEFAULT 'No zipCode Provided',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Review" (
"authorId" text  NOT NULL ,"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"rating" Decimal(65,30)  NOT NULL DEFAULT 0,"text" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Like" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"updatedAt" timestamp(3)  NOT NULL ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Catagory" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Tag" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Color" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."OtherFeature" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"itemId" text  NOT NULL ,"orderItemId" text   ,"text" text  NOT NULL ,"updatedAt" timestamp(3)  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "Seller.email" ON "public"."Seller"("email")

CREATE UNIQUE INDEX "Seller.sellerIdentification" ON "public"."Seller"("sellerIdentification")

CREATE UNIQUE INDEX "Seller.phone" ON "public"."Seller"("phone")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("sellerId")REFERENCES "public"."Seller"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE SET NULL  ON UPDATE CASCADE

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

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Color" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Color" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."OtherFeature" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."OtherFeature" ADD FOREIGN KEY ("orderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."_OrderToOrderItem" ADD FOREIGN KEY ("A")REFERENCES "public"."Order"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_OrderToOrderItem" ADD FOREIGN KEY ("B")REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200523200157-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,265 @@
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
+  ADMIN
+  USER
+  SELLER
+}
+
+enum Permission {
+  UPDATE_PERMISSION
+  ADD_ITEM
+  EDIT_ITEM
+  DELETE_ITEM
+  NONE
+}
+
+enum OrderStatus {
+  PENDING
+  DELIVERED
+  ONHOLD
+  APPROVED
+  ON_THE_WAY
+}
+
+model Seller {
+  id                       String      @default(cuid()) @id
+  name                     String
+  email                    String      @unique
+  password                 String
+  storeName                String
+  sellerNationality        String
+  sellerIdentification     String      @unique
+  confirmPassword          String?
+  EmailIsVerified          Boolean?    @default(false)
+  EmailVarificationHash    String?
+  PasswordResetToken       String?
+  PasswordResetTokenExpiry Float?
+  SellerItemsCout          Int?
+  role                     Role?       @default(SELLER)
+  phone                    String[]    @unique
+  PickupLocations          Address[]   @relation("ItemSeller")
+  Brand                    String[]
+  items                    Item[]
+  permissions              Permission? @default(ADD_ITEM)
+  createdAt                DateTime    @default(now())
+  updatedAt                DateTime    @updatedAt
+}
+
+model User {
+  id                       String      @default(cuid()) @id
+  email                    String      @unique
+  name                     String
+  password                 String
+  role                     Role?       @default(USER)
+  address                  Address[]
+  permissions              Permission? @default(NONE)
+  cart                     CartItem[]
+  likes                    Like[]
+  itemReview               Review[]
+  PasswordResetTokenExpiry Float?
+  reviewCount              Int?
+  likesCount               Int?
+  PasswordResetToken       String?
+  Order                    Order[]
+  avatar                   String?     @default("https://image.flaticon.com/icons/png/512/17/17004.png")
+  createdAt                DateTime    @default(now())
+  updatedAt                DateTime    @updatedAt
+}
+
+model Item {
+  id                  String         @default(cuid()) @id
+  title               String
+  description         String         @default("No Description Provided")
+  overview            String?        @default("No Overview Provided")
+  brand               String?        @default("No brand Provided")
+  weight              String?        @default("No weight Provided")
+  dimensions          String?        @default("No dimensions Provided")
+  materials           String?        @default("No materials Provided")
+  otherInfo           String?        @default("No Other Info Provided")
+  videoLink           String?        @default("No Video Link Provided")
+  Seller              Seller?        @relation(fields: [sellerId], references: [id])
+  sellerId            String?
+  price               Float
+  beforeDiscountPrice Float
+  stock               Int?           @default(1)
+  likesCount          Int?
+  reviewCount         Int?
+  itemReview          Review[]
+  images              ItemImage[]
+  catagory            Catagory[]
+  tags                Tag[]
+  colors              Color[]
+  OtherFeatures       OtherFeature[]
+  likes               Like[]
+  Order               Order[]
+  CartItem            CartItem[]
+  createdAt           DateTime       @default(now())
+  updatedAt           DateTime       @updatedAt
+}
+
+model Order {
+  id        String      @default(cuid()) @id
+  items     OrderItem[] @relation(references: [id])
+  total     Int
+  user      User        @relation(fields: [userId], references: [id])
+  userId    String
+  charge    String
+  status    OrderStatus @default(PENDING)
+  createdAt DateTime    @default(now())
+  updatedAt DateTime    @updatedAt
+  Item      Item?       @relation(fields: [itemId], references: [id])
+  itemId    String?
+}
+
+model OrderItem {
+  id                  String         @default(cuid()) @id
+  title               String
+  description         String         @default("No Description Provided")
+  price               Float
+  beforeDiscountPrice Float
+  overview            String?        @default("No Overview Provided")
+  otherInfo           String?        @default("No Other Info Provided")
+  videoLink           String?        @default("No Video Link Provided")
+  brand               String?        @default("No brand Provided")
+  weight              String?        @default("No weight Provided")
+  dimensions          String?        @default("No dimensions Provided")
+  materials           String?        @default("No materials Provided")
+  stock               Int?           @default(1)
+  likes               Like[]
+  itemReview          Review[]
+  images              ItemImage[]
+  catagory            Catagory[]
+  tags                Tag[]
+  colors              Color[]
+  OtherFeatures       OtherFeature[]
+  createdAt           DateTime       @default(now())
+  updatedAt           DateTime       @updatedAt
+  Order               Order[]        @relation(references: [id])
+}
+
+model CartItem {
+  id        String   @default(cuid()) @id
+  quantity  Int      @default(1)
+  item      Item     @relation(fields: [itemId], references: [id])
+  itemId    String
+  user      User     @relation(fields: [userId], references: [id])
+  userId    String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
+
+model ItemImage {
+  id          String     @default(cuid()) @id
+  url         String
+  largeUrl    String?
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+}
+
+model Address {
+  id                  String   @default(cuid()) @id
+  name                String
+  address             String
+  country             String   @default("No country Provided")
+  state               String   @default("No state Provided")
+  city                String   @default("No city Provided")
+  zipCode             String   @default("No zipCode Provided")
+  MaincontactNubmer   String
+  streetAddress1      String?  @default("No streetAddress1 Provided")
+  streetAddress2      String?  @default("No streetAddress2 Provided")
+  company             String?  @default("No company Provided")
+  message             String?  @default("No message Provided")
+  additionalInfo      String?
+  OthercontactNubmers String[]
+  isPrimary           Boolean? @default(false)
+  Lat                 Float?   @default(0)
+  Lng                 Float?   @default(0)
+  Seller              Seller?  @relation("ItemSeller", fields: [sellerId], references: [id])
+  sellerId            String?
+  User                User?    @relation(fields: [userId], references: [id])
+  userId              String?
+  updatedAt           DateTime @updatedAt
+  createdAt           DateTime @default(now())
+}
+
+model Review {
+  id          String     @default(cuid()) @id
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  author      User       @relation(fields: [authorId], references: [id])
+  authorId    String
+  rating      Float      @default(0)
+  text        String
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+}
+
+model Like {
+  id          String     @default(cuid()) @id
+  user        User       @relation(fields: [userId], references: [id])
+  userId      String
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+}
+
+model Catagory {
+  id          String     @default(cuid()) @id
+  text        String
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+}
+
+model Tag {
+  id          String     @default(cuid()) @id
+  text        String
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+}
+
+model Color {
+  id          String     @default(cuid()) @id
+  text        String
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+}
+
+model OtherFeature {
+  id          String     @default(cuid()) @id
+  text        String
+  item        Item       @relation(fields: [itemId], references: [id])
+  itemId      String
+  createdAt   DateTime   @default(now())
+  updatedAt   DateTime   @updatedAt
+  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
+  orderItemId String?
+}
```



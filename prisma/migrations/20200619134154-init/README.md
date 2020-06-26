# Migration `20200619134154-init`

This migration has been generated at 6/19/2020, 1:41:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Item" ADD COLUMN "OtherFeatures" text []  ,
ADD COLUMN "eagerImages" text []  ,
ADD COLUMN "images" text []  ;

ALTER TABLE "public"."Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "public"."OrderItem" ADD COLUMN "OtherFeatures" text []  ,
ADD COLUMN "eagerImages" text []  ,
ADD COLUMN "images" text []  ;

ALTER TABLE "public"."Seller" ALTER COLUMN "permissions" SET DEFAULT 'ADD_ITEM',
ALTER COLUMN "role" SET DEFAULT 'SELLER';

ALTER TABLE "public"."User" ALTER COLUMN "permissions" SET DEFAULT 'NONE',
ALTER COLUMN "role" SET DEFAULT 'USER';

ALTER TABLE "public"."ItemImage" DROP CONSTRAINT IF EXiSTS "ItemImage_itemId_fkey";

ALTER TABLE "public"."ItemImage" DROP CONSTRAINT IF EXiSTS "ItemImage_orderItemId_fkey";

ALTER TABLE "public"."OtherFeature" DROP CONSTRAINT IF EXiSTS "OtherFeature_itemId_fkey";

ALTER TABLE "public"."OtherFeature" DROP CONSTRAINT IF EXiSTS "OtherFeature_orderItemId_fkey";

DROP TABLE "public"."ItemImage";

DROP TABLE "public"."OtherFeature";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200523200157-init..20200619134154-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,265 +1,244 @@
-generator client {
-  provider = "prisma-client-js"
-}
-
-datasource db {
-  provider = "postgresql"
-  url = "***"
-}
-
-enum Role {
-  ADMIN
-  USER
-  SELLER
-}
-
-enum Permission {
-  UPDATE_PERMISSION
-  ADD_ITEM
-  EDIT_ITEM
-  DELETE_ITEM
-  NONE
-}
-
-enum OrderStatus {
-  PENDING
-  DELIVERED
-  ONHOLD
-  APPROVED
-  ON_THE_WAY
-}
-
-model Seller {
-  id                       String      @default(cuid()) @id
-  name                     String
-  email                    String      @unique
-  password                 String
-  storeName                String
-  sellerNationality        String
-  sellerIdentification     String      @unique
-  confirmPassword          String?
-  EmailIsVerified          Boolean?    @default(false)
-  EmailVarificationHash    String?
-  PasswordResetToken       String?
-  PasswordResetTokenExpiry Float?
-  SellerItemsCout          Int?
-  role                     Role?       @default(SELLER)
-  phone                    String[]    @unique
-  PickupLocations          Address[]   @relation("ItemSeller")
-  Brand                    String[]
-  items                    Item[]
-  permissions              Permission? @default(ADD_ITEM)
-  createdAt                DateTime    @default(now())
-  updatedAt                DateTime    @updatedAt
-}
-
-model User {
-  id                       String      @default(cuid()) @id
-  email                    String      @unique
-  name                     String
-  password                 String
-  role                     Role?       @default(USER)
-  address                  Address[]
-  permissions              Permission? @default(NONE)
-  cart                     CartItem[]
-  likes                    Like[]
-  itemReview               Review[]
-  PasswordResetTokenExpiry Float?
-  reviewCount              Int?
-  likesCount               Int?
-  PasswordResetToken       String?
-  Order                    Order[]
-  avatar                   String?     @default("https://image.flaticon.com/icons/png/512/17/17004.png")
-  createdAt                DateTime    @default(now())
-  updatedAt                DateTime    @updatedAt
-}
-
-model Item {
-  id                  String         @default(cuid()) @id
-  title               String
-  description         String         @default("No Description Provided")
-  overview            String?        @default("No Overview Provided")
-  brand               String?        @default("No brand Provided")
-  weight              String?        @default("No weight Provided")
-  dimensions          String?        @default("No dimensions Provided")
-  materials           String?        @default("No materials Provided")
-  otherInfo           String?        @default("No Other Info Provided")
-  videoLink           String?        @default("No Video Link Provided")
-  Seller              Seller?        @relation(fields: [sellerId], references: [id])
-  sellerId            String?
-  price               Float
-  beforeDiscountPrice Float
-  stock               Int?           @default(1)
-  likesCount          Int?
-  reviewCount         Int?
-  itemReview          Review[]
-  images              ItemImage[]
-  catagory            Catagory[]
-  tags                Tag[]
-  colors              Color[]
-  OtherFeatures       OtherFeature[]
-  likes               Like[]
-  Order               Order[]
-  CartItem            CartItem[]
-  createdAt           DateTime       @default(now())
-  updatedAt           DateTime       @updatedAt
-}
-
-model Order {
-  id        String      @default(cuid()) @id
-  items     OrderItem[] @relation(references: [id])
-  total     Int
-  user      User        @relation(fields: [userId], references: [id])
-  userId    String
-  charge    String
-  status    OrderStatus @default(PENDING)
-  createdAt DateTime    @default(now())
-  updatedAt DateTime    @updatedAt
-  Item      Item?       @relation(fields: [itemId], references: [id])
-  itemId    String?
-}
-
-model OrderItem {
-  id                  String         @default(cuid()) @id
-  title               String
-  description         String         @default("No Description Provided")
-  price               Float
-  beforeDiscountPrice Float
-  overview            String?        @default("No Overview Provided")
-  otherInfo           String?        @default("No Other Info Provided")
-  videoLink           String?        @default("No Video Link Provided")
-  brand               String?        @default("No brand Provided")
-  weight              String?        @default("No weight Provided")
-  dimensions          String?        @default("No dimensions Provided")
-  materials           String?        @default("No materials Provided")
-  stock               Int?           @default(1)
-  likes               Like[]
-  itemReview          Review[]
-  images              ItemImage[]
-  catagory            Catagory[]
-  tags                Tag[]
-  colors              Color[]
-  OtherFeatures       OtherFeature[]
-  createdAt           DateTime       @default(now())
-  updatedAt           DateTime       @updatedAt
-  Order               Order[]        @relation(references: [id])
-}
-
-model CartItem {
-  id        String   @default(cuid()) @id
-  quantity  Int      @default(1)
-  item      Item     @relation(fields: [itemId], references: [id])
-  itemId    String
-  user      User     @relation(fields: [userId], references: [id])
-  userId    String
-  createdAt DateTime @default(now())
-  updatedAt DateTime @updatedAt
-}
-
-model ItemImage {
-  id          String     @default(cuid()) @id
-  url         String
-  largeUrl    String?
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-}
-
-model Address {
-  id                  String   @default(cuid()) @id
-  name                String
-  address             String
-  country             String   @default("No country Provided")
-  state               String   @default("No state Provided")
-  city                String   @default("No city Provided")
-  zipCode             String   @default("No zipCode Provided")
-  MaincontactNubmer   String
-  streetAddress1      String?  @default("No streetAddress1 Provided")
-  streetAddress2      String?  @default("No streetAddress2 Provided")
-  company             String?  @default("No company Provided")
-  message             String?  @default("No message Provided")
-  additionalInfo      String?
-  OthercontactNubmers String[]
-  isPrimary           Boolean? @default(false)
-  Lat                 Float?   @default(0)
-  Lng                 Float?   @default(0)
-  Seller              Seller?  @relation("ItemSeller", fields: [sellerId], references: [id])
-  sellerId            String?
-  User                User?    @relation(fields: [userId], references: [id])
-  userId              String?
-  updatedAt           DateTime @updatedAt
-  createdAt           DateTime @default(now())
-}
-
-model Review {
-  id          String     @default(cuid()) @id
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  author      User       @relation(fields: [authorId], references: [id])
-  authorId    String
-  rating      Float      @default(0)
-  text        String
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-}
-
-model Like {
-  id          String     @default(cuid()) @id
-  user        User       @relation(fields: [userId], references: [id])
-  userId      String
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-}
-
-model Catagory {
-  id          String     @default(cuid()) @id
-  text        String
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-}
-
-model Tag {
-  id          String     @default(cuid()) @id
-  text        String
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-}
-
-model Color {
-  id          String     @default(cuid()) @id
-  text        String
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-}
-
-model OtherFeature {
-  id          String     @default(cuid()) @id
-  text        String
-  item        Item       @relation(fields: [itemId], references: [id])
-  itemId      String
-  createdAt   DateTime   @default(now())
-  updatedAt   DateTime   @updatedAt
-  OrderItem   OrderItem? @relation(fields: [orderItemId], references: [id])
-  orderItemId String?
-}
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
+  id                  String     @default(cuid()) @id
+  title               String
+  description         String     @default("No Description Provided")
+  overview            String?    @default("No Overview Provided")
+  brand               String?    @default("No brand Provided")
+  weight              String?    @default("No weight Provided")
+  dimensions          String?    @default("No dimensions Provided")
+  materials           String?    @default("No materials Provided")
+  otherInfo           String?    @default("No Other Info Provided")
+  videoLink           String?    @default("No Video Link Provided")
+  Seller              Seller?    @relation(fields: [sellerId], references: [id])
+  sellerId            String?
+  price               Float
+  beforeDiscountPrice Float
+  stock               Int?       @default(1)
+  likesCount          Int?
+  reviewCount         Int?
+  itemReview          Review[]
+  images              String[]
+  eagerImages         String[]
+  catagory            Catagory[]
+  tags                Tag[]
+  colors              Color[]
+  OtherFeatures       String[]
+  likes               Like[]
+  Order               Order[]
+  CartItem            CartItem[]
+  createdAt           DateTime   @default(now())
+  updatedAt           DateTime   @updatedAt
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
+  id                  String     @default(cuid()) @id
+  title               String
+  description         String     @default("No Description Provided")
+  price               Float
+  beforeDiscountPrice Float
+  overview            String?    @default("No Overview Provided")
+  otherInfo           String?    @default("No Other Info Provided")
+  videoLink           String?    @default("No Video Link Provided")
+  brand               String?    @default("No brand Provided")
+  weight              String?    @default("No weight Provided")
+  dimensions          String?    @default("No dimensions Provided")
+  materials           String?    @default("No materials Provided")
+  stock               Int?       @default(1)
+  likes               Like[]
+  itemReview          Review[]
+  images              String[]
+  eagerImages         String[]
+  catagory            Catagory[]
+  tags                Tag[]
+  colors              Color[]
+  OtherFeatures       String[]
+  createdAt           DateTime   @default(now())
+  updatedAt           DateTime   @updatedAt
+  Order               Order[]    @relation(references: [id])
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
```



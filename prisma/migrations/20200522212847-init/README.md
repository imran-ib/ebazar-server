# Migration `20200522212847-init`

This migration has been generated at 5/22/2020, 9:28:47 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Order" DROP CONSTRAINT IF EXiSTS "Order_itemId_fkey",
ADD COLUMN "OrderItemId" text  NOT NULL ,
ALTER COLUMN "itemId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "public"."Seller" ALTER COLUMN "permissions" SET DEFAULT 'ADD_ITEM',
ALTER COLUMN "role" SET DEFAULT 'SELLER';

ALTER TABLE "public"."User" ALTER COLUMN "permissions" SET DEFAULT 'NONE',
ALTER COLUMN "role" SET DEFAULT 'USER';

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("OrderItemId")REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE SET NULL  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200519205619-init..20200522212847-init
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 enum Role {
   ADMIN
@@ -77,22 +77,22 @@
 model Item {
   id                  String         @default(cuid()) @id
   title               String
   description         String         @default("No Description Provided")
-  price               Float
-  beforeDiscountPrice Float
   overview            String?        @default("No Overview Provided")
   brand               String?        @default("No brand Provided")
   weight              String?        @default("No weight Provided")
   dimensions          String?        @default("No dimensions Provided")
   materials           String?        @default("No materials Provided")
-  stock               Int?           @default(1)
-  likesCount          Int?
-  reviewCount         Int?
   otherInfo           String?        @default("No Other Info Provided")
   videoLink           String?        @default("No Video Link Provided")
   Seller              Seller?        @relation(fields: [sellerId], references: [id])
   sellerId            String?
+  price               Float
+  beforeDiscountPrice Float
+  stock               Int?           @default(1)
+  likesCount          Int?
+  reviewCount         Int?
   itemReview          Review[]
   images              ItemImage[]
   catagory            Catagory[]
   tags                Tags[]
@@ -105,18 +105,20 @@
   updatedAt           DateTime       @updatedAt
 }
 model Order {
-  id        String      @default(cuid()) @id
-  item      Item        @relation(fields: [itemId], references: [id])
-  itemId    String
-  total     Int
-  user      User        @relation(fields: [userId], references: [id])
-  userId    String
-  charge    String
-  status    OrderStatus @default(PENDING)
-  createdAt DateTime    @default(now())
-  updatedAt DateTime    @updatedAt
+  id          String      @default(cuid()) @id
+  items       OrderItem   @relation(fields: [OrderItemId], references: [id])
+  OrderItemId String
+  total       Int
+  user        User        @relation(fields: [userId], references: [id])
+  userId      String
+  charge      String
+  status      OrderStatus @default(PENDING)
+  createdAt   DateTime    @default(now())
+  updatedAt   DateTime    @updatedAt
+  Item        Item?       @relation(fields: [itemId], references: [id])
+  itemId      String?
 }
 model OrderItem {
   id                  String         @default(cuid()) @id
@@ -140,8 +142,9 @@
   colors              Colors[]
   oherFeatures        OherFeatures[]
   createdAt           DateTime       @default(now())
   updatedAt           DateTime       @updatedAt
+  Order               Order[]
 }
 model CartItem {
   id        String   @default(cuid()) @id
```



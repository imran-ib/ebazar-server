# Migration `20200522215642-init`

This migration has been generated at 5/22/2020, 9:56:44 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."_OrderToOrderItem" (
"A" text  NOT NULL ,"B" text  NOT NULL )

ALTER TABLE "public"."Order" DROP CONSTRAINT IF EXiSTS "Order_OrderItemId_fkey",
DROP COLUMN "OrderItemId",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "public"."Seller" ALTER COLUMN "permissions" SET DEFAULT 'ADD_ITEM',
ALTER COLUMN "role" SET DEFAULT 'SELLER';

ALTER TABLE "public"."User" ALTER COLUMN "permissions" SET DEFAULT 'NONE',
ALTER COLUMN "role" SET DEFAULT 'USER';

CREATE UNIQUE INDEX "_OrderToOrderItem_AB_unique" ON "public"."_OrderToOrderItem"("A","B")

CREATE  INDEX "_OrderToOrderItem_B_index" ON "public"."_OrderToOrderItem"("B")

ALTER TABLE "public"."_OrderToOrderItem" ADD FOREIGN KEY ("A")REFERENCES "public"."Order"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_OrderToOrderItem" ADD FOREIGN KEY ("B")REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200522212847-init..20200522215642-init
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
@@ -105,20 +105,19 @@
   updatedAt           DateTime       @updatedAt
 }
 model Order {
-  id          String      @default(cuid()) @id
-  items       OrderItem   @relation(fields: [OrderItemId], references: [id])
-  OrderItemId String
-  total       Int
-  user        User        @relation(fields: [userId], references: [id])
-  userId      String
-  charge      String
-  status      OrderStatus @default(PENDING)
-  createdAt   DateTime    @default(now())
-  updatedAt   DateTime    @updatedAt
-  Item        Item?       @relation(fields: [itemId], references: [id])
-  itemId      String?
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
 }
 model OrderItem {
   id                  String         @default(cuid()) @id
@@ -142,9 +141,9 @@
   colors              Colors[]
   oherFeatures        OherFeatures[]
   createdAt           DateTime       @default(now())
   updatedAt           DateTime       @updatedAt
-  Order               Order[]
+  Order               Order[]        @relation(references: [id])
 }
 model CartItem {
   id        String   @default(cuid()) @id
```



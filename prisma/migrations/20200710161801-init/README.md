# Migration `20200710161801-init`

This migration has been generated at 7/10/2020, 4:18:02 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "public"."OrderItem" ADD COLUMN "quantity" integer  NOT NULL DEFAULT 1;

ALTER TABLE "public"."Seller" ALTER COLUMN "permissions" SET DEFAULT 'ADD_ITEM',
ALTER COLUMN "role" SET DEFAULT 'SELLER';

ALTER TABLE "public"."User" ALTER COLUMN "permissions" SET DEFAULT 'NONE',
ALTER COLUMN "role" SET DEFAULT 'USER';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200710160700-init..20200710161801-init
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
@@ -130,8 +130,9 @@
   title               String
   description         String     @default("No Description Provided")
   price               Float
   beforeDiscountPrice Float
+  quantity            Int        @default(1)
   overview            String?    @default("No Overview Provided")
   otherInfo           String?    @default("No Other Info Provided")
   videoLink           String?    @default("No Video Link Provided")
   brand               String?    @default("No brand Provided")
```



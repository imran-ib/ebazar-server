# Migration `20200519201746-init`

This migration has been generated at 5/19/2020, 8:17:46 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "public"."Seller" ALTER COLUMN "confirmPassword" DROP NOT NULL,
ALTER COLUMN "permissions" SET DEFAULT 'ADD_ITEM',
ALTER COLUMN "role" SET DEFAULT 'SELLER';

ALTER TABLE "public"."User" ALTER COLUMN "permissions" SET DEFAULT 'NONE',
ALTER COLUMN "role" SET DEFAULT 'USER';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200519200942-init..20200519201746-init
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
@@ -33,12 +33,12 @@
   id                       String      @default(cuid()) @id
   name                     String
   email                    String      @unique
   password                 String
-  confirmPassword          String
   storeName                String
   sellerNationality        String
   sellerIdentification     String      @unique
+  confirmPassword          String?
   EmailIsVerified          Boolean?    @default(false)
   EmailVarificationHash    String?
   PasswordResetToken       String?
   PasswordResetTokenExpiry Float?
```


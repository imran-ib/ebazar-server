# Migration `20200519205619-init`

This migration has been generated at 5/19/2020, 8:56:20 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "public"."Seller" ALTER COLUMN "permissions" SET DEFAULT 'ADD_ITEM',
ALTER COLUMN "role" SET DEFAULT 'SELLER';

ALTER TABLE "public"."User" ALTER COLUMN "avatar" SET DEFAULT 'https://image.flaticon.com/icons/png/512/17/17004.png',
ALTER COLUMN "permissions" SET DEFAULT 'NONE',
ALTER COLUMN "role" SET DEFAULT 'USER';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200519201746-init..20200519205619-init
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
@@ -68,9 +68,9 @@
   reviewCount              Int?
   likesCount               Int?
   PasswordResetToken       String?
   Order                    Order[]
-  avatar                   String?     @default("https://www.freepik.com/free-icon/user-image-with-black-background_751548.htm")
+  avatar                   String?     @default("https://image.flaticon.com/icons/png/512/17/17004.png")
   createdAt                DateTime    @default(now())
   updatedAt                DateTime    @updatedAt
 }
```



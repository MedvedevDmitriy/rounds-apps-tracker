-- Rename App.appId -> googlePlayId (Play Store package name; avoids clashing with Screenshot.appId FK to App.id).
-- If a DB had Screenshot rows pointing at App.appId (package id), remap back to App.id first.

ALTER TABLE "Screenshot" DROP CONSTRAINT IF EXISTS "Screenshot_appId_fkey";

UPDATE "Screenshot" AS s
SET "appId" = a."id"
FROM "App" AS a
WHERE s."appId" = a."appId";

ALTER TABLE "Screenshot" ADD CONSTRAINT "Screenshot_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "App" RENAME COLUMN "appId" TO "googlePlayId";

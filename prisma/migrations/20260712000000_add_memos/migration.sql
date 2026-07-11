CREATE TABLE "Memo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Memo_userId_idx" ON "Memo"("userId");
CREATE UNIQUE INDEX "Memo_userId_key_key" ON "Memo"("userId", "key");

ALTER TABLE "Memo" ADD CONSTRAINT "Memo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

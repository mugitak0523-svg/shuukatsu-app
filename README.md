# Shuukatsu App

就活中の応募企業を管理するMVPです。

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Google OAuth、Neon PostgreSQLの接続情報を`.env`に設定してください。

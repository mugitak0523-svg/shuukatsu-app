# 就活管理アプリ MVP仕様書

## 1．概要

本アプリは，就活中の学生が応募企業や気になる企業を管理するためのWebアプリである．

初期MVPでは，Googleログインと企業リスト管理のみを実装する．
`/dashboard`は作成せず，ログイン後は`/companies`をメイン画面として扱う．

将来的には，企業データを中心に，カレンダー，ES管理，タスク管理，面接記録，AI支援機能を追加できるようにする．

## 2．MVPの目的

最初から多機能な就活管理アプリを作るのではなく，まずは以下の状態を目指す．

```txt
Googleでログインする
自分専用の企業リストを作る
企業ごとの選考状況や志望度を管理する
```

MVP完成時点では，カレンダーやES管理は不要とする．
ただし，後から自然に追加できるように，企業を中心としたデータ設計にする．

## 3．MVPで実装する機能

### 実装する機能

```txt
Googleログイン
ログアウト
企業一覧表示
企業追加
企業詳細表示
企業編集
企業削除
企業検索
ステータス表示
志望度表示
Empty State
Resend風のシンプルなUI
```

### 実装しない機能

```txt
/dashboard
カレンダー
ES管理
タスク管理
面接記録
通知
Googleカレンダー連携
AI添削
企業検索API連携
チーム共有
スマホアプリ化
```

## 4．技術スタック

### フロントエンド

```txt
Next.js App Router
TypeScript
Tailwind CSS
React Server Components
必要な箇所のみClient Components
```

### バックエンド

```txt
Next.js Server Actions
Prisma ORM
Neon PostgreSQL
```

### 認証

```txt
Auth.js
Google OAuth
Prisma Adapter
Database Session
```

### データベース

```txt
Neon PostgreSQL
Prisma schemaで管理
DATABASE_URL：アプリ実行用
DIRECT_URL：migration用
```

## 5．デザイン方針

Resendのような，白黒ベースのミニマルなSaaS管理画面にする．

### デザイン原則

```txt
白，黒，グレーを中心にする
余白を広めに取る
装飾を減らす
カードよりテーブルを中心にする
境界線は薄くする
影は使わない，またはかなり弱くする
メインボタンは黒背景＋白文字にする
ステータスや志望度は小さなバッジで表示する
```

### 色

```txt
背景：#ffffff
ページ背景：#fafafa
メイン文字：#111111
サブ文字：#666666
薄い文字：#999999
境界線：#e5e5e5
メインボタン：#111111
メインボタン文字：#ffffff
```

### フォント

```txt
Geist
Inter
system-ui
sans-serif
```

## 6．画面構成

## 6．1．トップページ

URL：

```txt
/
```

役割：

未ログインユーザー向けのランディングページ．
サービス概要を簡潔に表示し，Googleログインへ誘導する．

表示内容：

```txt
サービス名
キャッチコピー
説明文
Googleでログインボタン
シンプルな企業一覧UIのプレビュー
```

文言例：

```txt
就活の応募企業を，シンプルに一元管理．
```

ログイン済みユーザーがアクセスした場合：

```txt
/companies にリダイレクトする
```

## 6．2．ログインページ

URL：

```txt
/signin
```

役割：

Googleログインを行うページ．

表示内容：

```txt
ロゴ
Googleで続けるボタン
短い説明文
```

ログイン後の遷移先：

```txt
/companies
```

## 6．3．企業一覧ページ

URL：

```txt
/companies
```

役割：

ログイン後のメイン画面．
`/dashboard`は作らず，このページをアプリの中心にする．

表示内容：

```txt
ページタイトル
説明文
Add companyボタン
検索ボックス
ステータスフィルター
志望度フィルター
企業一覧テーブル
企業未登録時のEmpty State
```

ページタイトル例：

```txt
Companies
```

説明文例：

```txt
Manage companies you are applying to.
```

テーブル列：

```txt
Company
Industry
Job type
Status
Priority
Updated
Actions
```

企業未登録時の表示：

```txt
No companies yet
Add your first company to start tracking your job applications.
[Add company]
```

## 6．4．企業追加ページ

URL：

```txt
/companies/new
```

役割：

新しい企業を登録するページ．

入力項目：

```txt
企業名
業界
職種
選考ステータス
志望度
マイページURL
メモ
```

必須項目：

```txt
企業名
```

任意項目：

```txt
業界
職種
選考ステータス
志望度
マイページURL
メモ
```

保存後：

```txt
/companies に遷移する
```

## 6．5．企業詳細ページ

URL：

```txt
/companies/[companyId]
```

役割：

企業ごとの詳細情報を表示するページ．
将来的に，このページへ予定，ES，タスク，面接記録を追加する．

表示内容：

```txt
企業名
業界
職種
選考ステータス
志望度
マイページURL
メモ
作成日
更新日
編集ボタン
削除ボタン
```

将来追加する領域：

```txt
予定
ES
タスク
面接記録
企業研究メモ
```

## 6．6．企業編集ページ

URL：

```txt
/companies/[companyId]/edit
```

役割：

登録済み企業の情報を編集するページ．

仕様：

```txt
企業追加ページと同じフォームを使う
保存後は企業詳細ページへ戻る
他ユーザーの企業は編集できない
```

## 7．ルーティング一覧

```txt
/                              トップページ
/signin                        ログインページ
/companies                     企業一覧
/companies/new                 企業追加
/companies/[companyId]         企業詳細
/companies/[companyId]/edit    企業編集
/api/auth/[...nextauth]        Auth.js API route
```

作成しないルート：

```txt
/dashboard
```

## 8．ディレクトリ構成

```txt
job-hunt-manager/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  │
│  ├─ signin/
│  │  └─ page.tsx
│  │
│  ├─ companies/
│  │  ├─ page.tsx
│  │  ├─ new/
│  │  │  └─ page.tsx
│  │  └─ [companyId]/
│  │     ├─ page.tsx
│  │     └─ edit/
│  │        └─ page.tsx
│  │
│  └─ api/
│     └─ auth/
│        └─ [...nextauth]/
│           └─ route.ts
│
├─ components/
│  ├─ auth/
│  │  ├─ SignInButton.tsx
│  │  └─ SignOutButton.tsx
│  │
│  ├─ layout/
│  │  ├─ AppHeader.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ PageHeader.tsx
│  │  └─ UserMenu.tsx
│  │
│  ├─ companies/
│  │  ├─ CompanyForm.tsx
│  │  ├─ CompanyTable.tsx
│  │  ├─ CompanyStatusBadge.tsx
│  │  └─ CompanyPriorityBadge.tsx
│  │
│  └─ ui/
│     ├─ Button.tsx
│     ├─ Input.tsx
│     ├─ Select.tsx
│     ├─ Textarea.tsx
│     ├─ Badge.tsx
│     ├─ Table.tsx
│     └─ EmptyState.tsx
│
├─ lib/
│  ├─ db.ts
│  ├─ utils.ts
│  ├─ constants/
│  │  └─ company.ts
│  └─ validations/
│     └─ company.ts
│
├─ server/
│  ├─ actions/
│  │  └─ company.ts
│  └─ queries/
│     └─ company.ts
│
├─ prisma/
│  └─ schema.prisma
│
├─ types/
│  └─ next-auth.d.ts
│
├─ auth.ts
├─ prisma.config.ts
├─ middleware.ts
├─ .env
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ next.config.ts
└─ README.md
```

## 9．データ設計

## 9．1．User

Auth.jsで管理するユーザー．
Googleログイン時に作成される．

主な項目：

```txt
id
name
email
emailVerified
image
createdAt
updatedAt
```

## 9．2．Company

ユーザーが登録する企業．
必ず`userId`を持たせ，ログインユーザーごとに企業を分離する．

| 項目        | 型               | 必須 | 説明       |
| --------- | --------------- | -: | -------- |
| id        | String          | 必須 | 企業ID     |
| userId    | String          | 必須 | 所有ユーザーID |
| name      | String          | 必須 | 企業名      |
| industry  | String          | 任意 | 業界       |
| jobType   | String          | 任意 | 職種       |
| status    | CompanyStatus   | 必須 | 選考ステータス  |
| priority  | CompanyPriority | 任意 | 志望度      |
| mypageUrl | String          | 任意 | マイページURL |
| memo      | String          | 任意 | メモ       |
| createdAt | DateTime        | 必須 | 作成日時     |
| updatedAt | DateTime        | 必須 | 更新日時     |

## 10．ステータス定義

## 10．1．CompanyStatus

```txt
INTERESTED：気になる
APPLIED：応募済み
IN_PROGRESS：選考中
OFFER：内定
REJECTED：落選
DECLINED：辞退
```

MVPではステータスを細かくしすぎない．
将来的に，以下のような状態を追加してもよい．

```txt
ES作成中
ES提出済み
Webテスト
一次面接
二次面接
最終面接
```

## 10．2．CompanyPriority

```txt
S：第一志望群
A：志望度高
B：普通
C：低め
```

## 11．Prismaスキーマ

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?

  accounts      Account[]
  sessions      Session[]
  companies     Company[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}

model Company {
  id       String @id @default(cuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  name      String
  industry  String?
  jobType   String?
  status    CompanyStatus   @default(INTERESTED)
  priority  CompanyPriority?
  mypageUrl String?
  memo      String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([priority])
}

enum CompanyStatus {
  INTERESTED
  APPLIED
  IN_PROGRESS
  OFFER
  REJECTED
  DECLINED
}

enum CompanyPriority {
  S
  A
  B
  C
}
```

## 12．環境変数

```env
AUTH_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AUTH_GOOGLE_ID="xxxxxxxxxxxxxxxxxxxxxxxx"
AUTH_GOOGLE_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"

DATABASE_URL="postgresql://user:password@xxxxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@xxxxx.region.aws.neon.tech/dbname?sslmode=require"
```

## 13．認証仕様

## 13．1．ログイン

```txt
Googleログインのみ対応する
ログインページは /signin
ログイン後は /companies に遷移する
ログイン済みユーザーが / にアクセスした場合は /companies に遷移する
```

## 13．2．ログアウト

```txt
UserMenuからログアウトできる
ログアウト後は / に戻る
```

## 13．3．未ログイン制御

未ログイン状態で以下のページへアクセスした場合，`/signin`へリダイレクトする．

```txt
/companies
/companies/new
/companies/[companyId]
/companies/[companyId]/edit
```

## 13．4．認可

企業データにアクセスする処理では，必ず`userId`で所有者を確認する．

禁止：

```ts
where: {
  id: companyId
}
```

許可：

```ts
where: {
  id: companyId,
  userId: user.id
}
```

これにより，他ユーザーの企業詳細，編集，削除ができないようにする．

## 14．Auth.js設定方針

ルート直下に`auth.ts`を配置する．

```txt
auth.ts
```

`app/api/auth/[...nextauth]/route.ts`では，`auth.ts`からhandlerを再exportする．

```ts
export { GET, POST } from "@/auth"
```

Googleログイン後は`/companies`へ遷移させる．

```ts
await signIn("google", { redirectTo: "/companies" })
```

## 15．主要処理

## 15．1．企業一覧取得

処理名：

```txt
getCompanies
```

仕様：

```txt
ログインユーザーを取得する
未ログインなら /signin にリダイレクトする
ログインユーザーの userId で企業を絞り込む
updatedAt の降順で返す
検索キーワードがあれば企業名，業界，職種を検索する
ステータス指定があれば status で絞る
志望度指定があれば priority で絞る
```

## 15．2．企業詳細取得

処理名：

```txt
getCompanyById
```

仕様：

```txt
ログインユーザーを取得する
companyId と userId の両方で検索する
存在しない場合は notFound を返す
```

## 15．3．企業作成

処理名：

```txt
createCompany
```

仕様：

```txt
未ログインならエラー
企業名が空ならエラー
入力値をtrimする
任意項目が空文字の場合はnullとして保存する
作成後，/companiesをrevalidateする
作成後，/companiesへ遷移する
```

## 15．4．企業更新

処理名：

```txt
updateCompany
```

仕様：

```txt
未ログインならエラー
対象企業がログインユーザーのものか確認する
企業名が空ならエラー
入力値をtrimする
更新後，企業詳細ページへ遷移する
```

## 15．5．企業削除

処理名：

```txt
deleteCompany
```

仕様：

```txt
未ログインならエラー
対象企業がログインユーザーのものか確認する
MVPでは物理削除する
削除後，/companiesへ遷移する
```

## 16．UIコンポーネント仕様

## 16．1．AppHeader

役割：

```txt
画面上部のヘッダー
サービス名
ユーザーメニュー
ログアウト導線
```

## 16．2．Sidebar

MVP時点の表示：

```txt
Companies
```

将来的な表示：

```txt
Companies
Calendar
Tasks
ES
Interviews
Settings
```

## 16．3．PageHeader

表示内容：

```txt
ページタイトル
説明文
右側の主要アクションボタン
```

企業一覧ページでは，右側に`Add company`ボタンを表示する．

## 16．4．Button

variant：

```txt
primary：黒背景＋白文字
secondary：白背景＋border
ghost：背景なし
danger：削除用
```

## 16．5．Badge

用途：

```txt
選考ステータス
志望度
```

表示例：

```txt
気になる
応募済み
選考中
内定
落選
辞退
S
A
B
C
```

## 16．6．CompanyTable

表示列：

```txt
Company
Industry
Job type
Status
Priority
Updated
Actions
```

操作：

```txt
行クリックで企業詳細へ移動
Actionsから編集できる
Actionsから削除できる
```

## 16．7．CompanyForm

作成と編集で共通利用する．

入力項目：

```txt
企業名
業界
職種
ステータス
志望度
マイページURL
メモ
```

仕様：

```txt
企業名のみ必須
保存ボタンをフォーム下部に配置する
キャンセルボタンを配置する
```

## 16．8．EmptyState

企業未登録時に表示する．

表示例：

```txt
No companies yet
Add your first company to start tracking your job applications.
[Add company]
```

## 17．バリデーション

## 17．1．企業名

```txt
必須
1文字以上
100文字以内
```

## 17．2．業界

```txt
任意
100文字以内
```

## 17．3．職種

```txt
任意
100文字以内
```

## 17．4．マイページURL

```txt
任意
URL形式
空欄可
```

## 17．5．メモ

```txt
任意
5000文字以内
```

## 18．ナビゲーション仕様

MVP時点では，ログイン後の基本導線は以下とする．

```txt
ログイン
↓
/companies
↓
企業追加
↓
/companies
↓
企業詳細
↓
企業編集
```

`/dashboard`は存在しない．

## 19．将来拡張設計

企業を中心に以下のように拡張する．

```txt
User
└─ Company
   ├─ Event
   ├─ Task
   ├─ Essay
   ├─ Interview
   └─ CompanyNote
```

## 19．1．Phase 1

```txt
Googleログイン
企業一覧
企業追加
企業詳細
企業編集
企業削除
```

## 19．2．Phase 2

```txt
カレンダー
説明会予定
ES締切
Webテスト締切
面接予定
```

## 19．3．Phase 3

```txt
タスク管理
企業ごとのToDo
今日やること
期限管理
```

## 19．4．Phase 4

```txt
ES管理
設問保存
回答保存
文字数カウント
過去ES検索
```

## 19．5．Phase 5

```txt
面接記録
聞かれた質問
回答メモ
反省点
次回対策
```

## 19．6．Phase 6

```txt
AI支援
ES添削
志望動機作成
面接質問生成
企業研究補助
```

## 20．将来追加するDB例

## 20．1．Event

```prisma
model Event {
  id        String @id @default(cuid())
  userId    String
  companyId String?

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company   Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)

  title     String
  type      EventType
  startAt   DateTime
  endAt     DateTime?
  location  String?
  url       String?
  memo      String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([companyId])
}

enum EventType {
  BRIEFING
  ES_DEADLINE
  WEB_TEST
  INTERVIEW
  GROUP_DISCUSSION
  INTERNSHIP
  OTHER
}
```

## 20．2．Task

```prisma
model Task {
  id        String @id @default(cuid())
  userId    String
  companyId String?

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company   Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)

  title     String
  dueAt     DateTime?
  status    TaskStatus @default(TODO)
  memo      String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([companyId])
}

enum TaskStatus {
  TODO
  DONE
}
```

## 20．3．Essay

```prisma
model Essay {
  id        String @id @default(cuid())
  userId    String
  companyId String

  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  question  String
  answer    String?
  wordLimit Int?
  status    EssayStatus @default(DRAFT)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([companyId])
}

enum EssayStatus {
  DRAFT
  SUBMITTED
}
```

## 21．受け入れ条件

## 21．1．認証

```txt
Googleアカウントでログインできる
ログアウトできる
ログイン後は /companies に遷移する
未ログイン時に /companies へアクセスできない
他ユーザーの企業データを閲覧できない
```

## 21．2．企業一覧

```txt
企業がない場合はEmpty Stateが表示される
企業を追加すると一覧に表示される
一覧は更新日順に表示される
企業名，業界，職種，ステータス，志望度が確認できる
検索できる
ステータスで絞り込める
志望度で絞り込める
```

## 21．3．企業追加

```txt
企業名だけで登録できる
企業名が空の場合は保存できない
任意項目は空欄でも保存できる
保存後は /companies に戻る
```

## 21．4．企業詳細

```txt
企業の詳細情報が表示される
編集ページへ移動できる
削除できる
他ユーザーの企業詳細は表示できない
```

## 21．5．企業編集

```txt
登録済み情報を変更できる
企業名が空の場合は保存できない
保存後は企業詳細ページへ戻る
他ユーザーの企業は編集できない
```

## 21．6．企業削除

```txt
自分の企業のみ削除できる
削除後は /companies に戻る
一覧から削除済み企業が消える
他ユーザーの企業は削除できない
```

## 22．実装優先順位

## Step 1

```txt
Next.js初期セットアップ
Tailwind CSS設定
基本レイアウト作成
Resend風UIの土台作成
```

## Step 2

```txt
Neonプロジェクト作成
Prisma設定
schema.prisma作成
migration実行
```

## Step 3

```txt
Auth.js設定
Google OAuth設定
Prisma Adapter設定
ログインページ作成
ログイン後 /companies 遷移
```

## Step 4

```txt
Companyモデル作成
企業一覧取得
/companies作成
Empty State作成
```

## Step 5

```txt
企業追加フォーム作成
createCompany実装
企業一覧への反映
```

## Step 6

```txt
企業詳細ページ作成
企業編集ページ作成
updateCompany実装
deleteCompany実装
```

## Step 7

```txt
検索
ステータスフィルター
志望度フィルター
UI調整
```

## 23．MVP完成時の状態

MVP完成時点では，ユーザーは以下を行える．

```txt
Googleでログインする
ログイン後に /companies を開く
自分専用の企業リストを見る
企業を追加する
企業情報を編集する
企業を削除する
企業の選考ステータスを管理する
志望度を設定する
企業名で検索する
ステータスや志望度で絞り込む
```

この段階では`/dashboard`は不要とする．
今後，予定や締切が増えてきた段階で，必要に応じて`/calendar`や`/tasks`を追加する．

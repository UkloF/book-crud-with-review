# คู่มือ Prisma Schema: Syntax และความสัมพันธ์ระหว่างตาราง

คู่มือภาษาไทยสำหรับโปรเจกต์นี้ซึ่งใช้ **Prisma 6 + SQLite** ใช้หนังสือ รีวิว และหมวดหมู่เป็นตัวอย่าง สามารถนำแนวคิดไปปรับใช้กับร้านอาหารหรือระบบอื่นได้

เอกสารนี้เป็นตัวอย่างประกอบการเรียนรู้ ไม่ได้เปลี่ยน schema หรือฐานข้อมูลจริง ตัวอย่างความสัมพันธ์แต่ละแบบเป็นทางเลือกแยกกัน อย่าคัดลอก Model ชื่อซ้ำจากทุกตัวอย่างรวมไว้ในไฟล์เดียว

## 1. โครงสร้างของ schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

| ส่วน | หน้าที่ |
| --- | --- |
| `generator client` | กำหนดการสร้าง Prisma Client สำหรับเรียกฐานข้อมูลจาก TypeScript |
| `provider = "prisma-client-js"` | เลือกตัวสร้าง Client ที่โปรเจกต์นี้ใช้ |
| `datasource db` | กำหนดการเชื่อมต่อฐานข้อมูล |
| `provider = "sqlite"` | เลือกชนิดฐานข้อมูลเป็น SQLite |
| `env("DATABASE_URL")` | อ่านตำแหน่งฐานข้อมูลจาก environment |

ตัวอย่างค่าใน `.env` ที่โฟลเดอร์หลัก:

```env
DATABASE_URL="file:./dev.db"
```

สำหรับโครงสร้างโปรเจกต์นี้ path ของ SQLite อ้างอิงจากตำแหน่งไฟล์ schema จึงหมายถึง `prisma/dev.db`

## 2. Model และการประกาศฟิลด์

รูปแบบพื้นฐานคือ `ชื่อฟิลด์ ชนิดข้อมูล คุณสมบัติเพิ่มเติม` เช่น:

```prisma
model Book {
  id    Int    @id @default(autoincrement())
  title String
}
```

- `model Book` กำหนด Model หนังสือ ซึ่งใช้ชื่อตาราง `Book` โดยค่าเริ่มต้น
- `id` และ `title` คือชื่อฟิลด์
- โค้ด TypeScript เรียก Model นี้ผ่าน `this.prisma.book`
- `// ข้อความ` ใช้เขียนคอมเมนต์อธิบายภายใน schema

### ชนิดข้อมูลที่ใช้บ่อย

| ชนิด | ความหมาย | ตัวอย่างฟิลด์ |
| --- | --- | --- |
| `String` | ข้อความ | `title String` |
| `Int` | จำนวนเต็ม | `rating Int` |
| `Float` | จำนวนทศนิยม | `score Float` |
| `Boolean` | จริงหรือเท็จ | `isActive Boolean` |
| `DateTime` | วันที่และเวลา | `createdAt DateTime` |

### เครื่องหมาย ? และ []

| ตัวอย่าง | ความหมาย |
| --- | --- |
| `title String` | ต้องมีค่าข้อความ ไม่รับ `null` |
| `coverUrl String?` | เป็นข้อความหรือ `null` ได้ |
| `review Review?` | เชื่อมกับรีวิวหนึ่งรายการ หรือยังไม่มีรีวิว |
| `reviews Review[]` | เชื่อมกับรีวิวได้ศูนย์รายการขึ้นไป |

`Review[]` เป็นฟิลด์ความสัมพันธ์ ไม่ใช่คอลัมน์ array ในตารางหนังสือ และไม่ควรนำไปเทียบกับ `String[]` เพราะ SQLite ใน Prisma 6 ไม่รองรับ scalar lists แบบนั้น

ฟิลด์บังคับที่มี `@default` อาจไม่ต้องส่งมาตอนสร้าง เพราะระบบมีค่าเริ่มต้นให้ ส่วนฟิลด์บังคับที่ไม่มี default และไม่ได้ถูกสร้างให้อัตโนมัติต้องได้รับค่าตอนบันทึก

## 3. คุณสมบัติระดับฟิลด์: @

| Syntax | ความหมาย | ตัวอย่าง |
| --- | --- | --- |
| `@id` | Primary Key ระบุแต่ละแถว | `id Int @id` |
| `@default(autoincrement())` | สร้างเลขเพิ่มอัตโนมัติ | `id Int @id @default(autoincrement())` |
| `@default(now())` | ค่าเริ่มต้นเป็นเวลาปัจจุบัน | `createdAt DateTime @default(now())` |
| `@default(0)` | ค่าเริ่มต้นเป็นศูนย์ | `viewCount Int @default(0)` |
| `@default(true)` | ค่าเริ่มต้นเป็นจริง | `isActive Boolean @default(true)` |
| `@default("ทั่วไป")` | ค่าเริ่มต้นเป็นข้อความ | `category String @default("ทั่วไป")` |
| `@unique` | บังคับค่าไม่ให้ซ้ำ | `isbn String @unique` |
| `@updatedAt` | Prisma จัดการเวลาเมื่อสร้างหรือแก้ไขผ่าน Client | `updatedAt DateTime @updatedAt` |
| `@map("ชื่อคอลัมน์")` | แมปชื่อฟิลด์กับชื่อคอลัมน์จริง | `coverUrl String? @map("cover_url")` |
| `@relation(...)` | กำหนดรายละเอียดความสัมพันธ์ | ดูตัวอย่างในหัวข้อถัดไป |

`@updatedAt` ทำงานในระดับ Prisma ไม่ใช่ trigger ของ SQLite หากใช้ SQL แก้ข้อมูลโดยตรงต้องจัดการเวลาส่วนนี้เอง และ `@default(now())` เป็นค่าเริ่มต้น ไม่ได้เปลี่ยนเวลาทุกครั้งที่อัปเดต

### ตัวอย่างรวมคุณสมบัติพื้นฐาน

```prisma
model Book {
  id        Int      @id @default(autoincrement())
  title     String
  author    String
  isbn      String   @unique
  coverUrl  String?  @map("cover_url")
  viewCount Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([author])
  @@map("books")
}
```

ตัวอย่างนี้เพิ่มฟิลด์เพื่ออธิบาย syntax ไม่ใช่ schema ปัจจุบันของโปรเจกต์

## 4. คุณสมบัติระดับ Model: @@

เขียนภายใน `{ ... }` ของ Model โดยแยกจากบรรทัดฟิลด์:

| Syntax | ความหมาย |
| --- | --- |
| `@@map("books")` | กำหนดชื่อตารางจริงเป็น `books` โดยชื่อ Model และการเรียก `prisma.book` ยังเหมือนเดิม |
| `@@index([author])` | สร้าง index เพื่อช่วยค้นหาตามผู้แต่ง ไม่ได้บังคับไม่ให้ซ้ำ |
| `@@index([author, title])` | สร้าง index ที่ประกอบด้วยหลายคอลัมน์ |
| `@@unique([title, author])` | ห้ามคู่ชื่อหนังสือและผู้แต่งซ้ำกัน แต่ชื่อหรือผู้แต่งอย่างใดอย่างหนึ่งยังซ้ำได้ |
| `@@id([bookId, categoryId])` | ใช้หลายคอลัมน์ร่วมกันเป็น Primary Key ดูตารางกลางในตัวอย่างหลาย–หลาย |

จำว่า `@` ใช้กับฟิลด์ ส่วน `@@` ใช้กับทั้ง Model การเพิ่ม `@@unique` ในตารางที่มีข้อมูลแล้วต้องตรวจข้อมูลซ้ำก่อน

## 5. ภาพรวมความสัมพันธ์

| รูปแบบ | ตัวอย่าง | วิธีสังเกต |
| --- | --- | --- |
| 1–1 | หนังสือหนึ่งเล่มมีได้ไม่เกินหนึ่งรีวิว | Foreign Key ฝั่งรีวิวมี `@unique` |
| 1–หลาย หรือ 1–* | หนังสือหนึ่งเล่มมีหลายรีวิว | ฝั่งหนังสือเป็น `Review[]` และ `bookId` ซ้ำได้ |
| หลาย–หลาย หรือ *–* | หนังสือมีหลายหมวดหมู่ แต่ละหมวดหมู่มีหลายหนังสือ | ต้องมีตารางกลาง ซึ่ง Prisma จัดการให้หรือประกาศเองได้ |

Foreign Key คือคอลัมน์ที่อ้างถึงข้อมูลอีกตาราง เช่น `Review.bookId` อ้างถึง `Book.id`

## 6. One-to-One: 1–1

```text
Book หนึ่งเล่ม ─── มีรีวิวได้ 0 หรือ 1 รายการ
Review หนึ่งรายการ ─── เป็นของ Book หนึ่งเล่ม
```

```prisma
model Book {
  id     Int     @id @default(autoincrement())
  title  String
  review Review?
}

model Review {
  id      Int    @id @default(autoincrement())
  rating  Int
  content String
  bookId  Int    @unique
  book    Book   @relation(fields: [bookId], references: [id], onDelete: Cascade)
}
```

จุดสำคัญ:

- `bookId @unique` ป้องกันรีวิวหลายรายการอ้างถึงหนังสือเล่มเดียวกัน
- `review Review?` อนุญาตให้สร้างหนังสือก่อนมีรีวิว
- `book Book` และ `bookId Int` บังคับให้แต่ละรีวิวมีหนังสือที่อ้างถึง
- ตัวอย่างนี้บังคับว่ามีได้ **ไม่เกินหนึ่งรีวิว** ไม่ได้บังคับว่าหนังสือทุกเล่มต้องมีหนึ่งรีวิวเสมอ

### อ่านหนังสือพร้อมรีวิว

```ts
return this.prisma.book.findUnique({
  where: { id },
  include: { review: true },
});
```

ตัวอย่างผลลัพธ์เมื่อมีรีวิว:

```json
{
  "id": 1,
  "title": "เจ้าชายน้อย",
  "review": {
    "id": 1,
    "rating": 5,
    "content": "อ่านสนุก",
    "bookId": 1
  }
}
```

ถ้าพบหนังสือแต่ยังไม่มีรีวิว จะได้ `"review": null` ถ้าไม่พบหนังสือ `findUnique()` จะคืน `null` ทั้งก้อน

### ถ้าปรับงานปัจจุบันจากหลายรีวิวเป็นหนึ่งรีวิว

1. ตรวจและจัดการรีวิวที่มี `bookId` ซ้ำ โดยเลือกข้อมูลที่จะเก็บก่อนเพิ่ม `@unique`
2. เปลี่ยน `reviews Review[]` เป็น `review Review?` และเพิ่ม `@unique` ที่ `bookId`
3. เปลี่ยน `include` ใน Service จาก `reviews` เป็น `review` ทุกจุด
4. เปลี่ยน interface จาก `reviews?: Review[]` เป็น `review?: Review | null`
5. ปรับ frontend และ tests ให้รับ object หรือ `null` แทน array
6. จัดการกรณีเพิ่มรีวิวซ้ำใน `addReview()` เช่น ตอบ HTTP `409 Conflict` เมื่อ Prisma แจ้ง unique constraint violation (`P2002`) การเช็กก่อนสร้างเพียงอย่างเดียวอาจมีคำขอพร้อมกัน จึงต้องจัดการข้อผิดพลาดจากฐานข้อมูลด้วย

## 7. One-to-Many: 1–หลาย หรือ 1–*

รูปแบบนี้ตรงกับความสัมพันธ์ในโปรเจกต์ปัจจุบัน ตัวอย่างย่อด้านล่างละฟิลด์หนังสือบางส่วนเพื่อให้อ่านความสัมพันธ์ง่ายขึ้น

```text
Book หนึ่งเล่ม ─── มี Review ได้ 0 ถึงหลายรายการ
Review แต่ละรายการ ─── เป็นของ Book หนึ่งเล่ม
```

```prisma
model Book {
  id      Int      @id @default(autoincrement())
  title   String
  reviews Review[]
}

model Review {
  id      Int    @id @default(autoincrement())
  rating  Int
  content String
  bookId  Int
  book    Book   @relation(fields: [bookId], references: [id], onDelete: Cascade)
}
```

- `reviews Review[]` หมายถึงรายการรีวิวของหนังสือ
- `bookId` ไม่มี `@unique` รีวิวหลายแถวจึงใช้เลขหนังสือเดียวกันได้
- `bookId` เป็นคอลัมน์จริง ส่วน `book` และ `reviews` เป็นฟิลด์ relation สำหรับ Prisma

### อ่านหนังสือพร้อมรายการรีวิว

```ts
return this.prisma.book.findUnique({
  where: { id },
  include: { reviews: true },
});
```

```json
{
  "id": 1,
  "title": "เจ้าชายน้อย",
  "reviews": [
    { "id": 1, "rating": 5, "content": "อ่านสนุก", "bookId": 1 },
    { "id": 2, "rating": 4, "content": "ชอบเนื้อเรื่อง", "bookId": 1 }
  ]
}
```

ถ้าพบหนังสือแต่ยังไม่มีรีวิว จะได้ `"reviews": []`

`include: { reviews: true }` หมายถึงให้ผลลัพธ์มีรีวิวที่เกี่ยวข้อง ไม่ได้สั่งสร้างรีวิวใหม่ แม้ใส่ใน `book.create()` ก็เป็นการเลือกข้อมูลที่จะส่งกลับ หากต้องการสร้างรีวิวด้วยต้องเขียน nested `create` ใน `data` หรือเรียก `review.create()` แยก

## 8. Many-to-Many: หลาย–หลาย หรือ *–*

```text
Book หนึ่งเล่ม ─── อยู่ได้หลาย Category
Category หนึ่งหมวด ─── มีได้หลาย Book
```

### แบบ implicit: ให้ Prisma จัดการตารางกลาง

```prisma
model Book {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  books Book[]
}
```

ถึงไม่ประกาศ Model ตารางกลาง ก็มีตารางกลางจริงในฐานข้อมูล โดย Prisma จัดการให้ เหมาะกับความสัมพันธ์ที่ไม่ต้องเก็บข้อมูลเพิ่มเกี่ยวกับการเชื่อมโยง แต่ละ Model ในตัวอย่างใช้ Primary Key เดี่ยวตามข้อกำหนดของ implicit relation ใน Prisma 6

อ่านหมวดหมู่ของหนังสือ:

```ts
return this.prisma.book.findUnique({
  where: { id },
  include: { categories: true },
});
```

เชื่อมหนังสือกับหมวดหมู่ที่มีอยู่แล้ว โดย `bookId` และ `categoryId` เป็นเลขที่มีจริง:

```ts
return this.prisma.book.update({
  where: { id: bookId },
  data: {
    categories: { connect: { id: categoryId } },
  },
  include: { categories: true },
});
```

### แบบ explicit: ประกาศตารางกลางเอง

เหมาะเมื่ออยากเก็บรายละเอียดความสัมพันธ์ เช่น วันที่เพิ่มหนังสือเข้าหมวดหมู่ หรือกำหนด `onDelete` ของตารางกลางเอง

```prisma
model Book {
  id         Int            @id @default(autoincrement())
  title      String
  categories BookCategory[]
}

model Category {
  id    Int            @id @default(autoincrement())
  name  String         @unique
  books BookCategory[]
}

model BookCategory {
  bookId     Int
  categoryId Int
  assignedAt DateTime @default(now())
  book       Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([bookId, categoryId])
  @@index([categoryId])
}
```

- `BookCategory` คือตารางกลาง เก็บคู่หนังสือกับหมวดหมู่
- `@@id([bookId, categoryId])` ใช้คู่เลขเป็น Primary Key ทำให้หนังสือเดียวกันเข้าหมวดเดิมซ้ำไม่ได้
- ไม่ต้องมี `id` แยก หากใช้ composite Primary Key แบบนี้
- `assignedAt` เป็นข้อมูลเพิ่มเติมของความสัมพันธ์
- ลบหนังสือหรือหมวดหมู่แล้วแถวที่เชื่อมโยงในตารางกลางจะถูกลบ แต่ไม่ได้ลบหนังสือหรือหมวดหมู่อีกฝั่งตามไปด้วย

อ่านข้อมูลโดยผ่านตารางกลาง:

```ts
return this.prisma.book.findUnique({
  where: { id },
  include: {
    categories: {
      include: { category: true },
    },
  },
});
```

ผลลัพธ์ `categories` จะเป็น array ของแถว `BookCategory` ที่มีข้อมูล `category` ซ้อนอยู่ จึงมีรูปแบบต่างจาก implicit ที่คืนรายการ Category โดยตรง

## 9. อ่าน @relation และ onDelete อย่างไร

```text
@relation(fields: [bookId], references: [id], onDelete: Cascade)
```

| ส่วน | ความหมาย |
| --- | --- |
| `fields: [bookId]` | ใช้คอลัมน์ `bookId` ของ Model ปัจจุบันเป็น Foreign Key |
| `references: [id]` | อ้างถึง `id` ของ Model ปลายทาง |
| `onDelete` | กำหนดว่าจะจัดการข้อมูลลูกอย่างไรเมื่อลบข้อมูลแม่ |

| ค่า onDelete | ตัวอย่างผลเมื่อลบหนังสือ |
| --- | --- |
| `Cascade` | ลบรีวิวที่อ้างถึงหนังสือด้วย |
| `Restrict` | ไม่ให้ลบหนังสือขณะที่ยังมีรีวิวอ้างถึง |
| `SetNull` | เก็บรีวิวไว้ แต่เปลี่ยน Foreign Key เป็น `null` |

สำหรับ `SetNull` ต้องทำให้ทั้ง Foreign Key และ relation รองรับ `null` ตัวอย่างนี้เป็นอีกทางเลือกหนึ่ง ไม่ใช้ร่วมกับ schema รีวิวที่บังคับ `bookId` ด้านบน:

```prisma
model Book {
  id      Int      @id @default(autoincrement())
  title   String
  reviews Review[]
}

model Review {
  id      Int    @id @default(autoincrement())
  rating  Int
  content String
  bookId  Int?
  book    Book?  @relation(fields: [bookId], references: [id], onDelete: SetNull)
}
```

ใน implicit many-to-many ของ Prisma 6 ไม่กำหนด `onDelete` บน relation โดยตรง หากต้องการควบคุมส่วนนี้ให้ใช้ตารางกลางแบบ explicit

## 10. สิ่งที่ต้องแก้ตามเมื่อเปลี่ยน Schema

| ส่วน | ตรวจอะไรบ้าง |
| --- | --- |
| Schema | ฟิลด์ ชนิดข้อมูล relation และ constraints |
| DTO | ข้อมูลที่ API อนุญาตให้รับ ต้องไม่เปิดทุกคอลัมน์โดยอัตโนมัติ |
| Service | ฟิลด์ใน `data`, การแปลงวันที่, ชื่อ Model และชื่อ relation ใน `include` |
| Interface | ชนิดข้อมูลที่ตรงกับ schema เช่น array เทียบกับ object หรือ `null` |
| Controller | แก้เมื่อเส้นทางหรือรูปแบบการรับข้อมูลเปลี่ยน ไม่จำเป็นสำหรับทุกการเพิ่มคอลัมน์ |
| Frontend / Postman / tests | ชื่อฟิลด์ รูปแบบ request/response และกรณีผิดพลาด |

ข้อควรระวังเพิ่มเติม:

- `rating Int` บังคับแค่ชนิดจำนวนเต็ม ไม่ได้กำหนดช่วง 1–5 งานปัจจุบันตรวจช่วงนี้ใน Service
- ชนิดข้อมูลใน DTO ไม่ได้ตรวจ request ตอนรันจริงโดยอัตโนมัติ
- `@map` และ `@@map` กำหนดการแมปชื่อ ไม่ได้เปลี่ยนฐานข้อมูลจริงทันที ต้องตรวจและนำ migration ไปใช้
- เปลี่ยนชื่อหรือลบคอลัมน์ต้องตรวจ SQL เพราะอาจเสียข้อมูล หากเพิ่มฟิลด์บังคับต้องเตรียมค่าสำหรับแถวเดิม
- หากไม่เปลี่ยนชื่อ Model การเปลี่ยนชื่อตารางด้วย `@@map` ไม่ได้ทำให้ต้องเปลี่ยน `prisma.book`

หลังแก้ schema ใช้ลำดับตรวจและอัปเดตสำหรับเครื่องพัฒนา:

```powershell
npx prisma validate
npx prisma migrate dev --name describe_schema_change
npx prisma generate
npm run build
```

`validate` ตรวจ schema โดยไม่แก้ฐานข้อมูล ส่วน `migrate dev` เปลี่ยนฐานข้อมูลจริง ต้องสำรองข้อมูลและตรวจเป้าหมายก่อนรัน หากมีฐานข้อมูลเดิมแต่ไม่มีประวัติ migration ต้องจัดการ baseline และอย่าตอบ reset โดยไม่ตรวจสอบ

อ่านขั้นตอนเพิ่มคอลัมน์ การสำรองข้อมูล และการทดสอบ API อย่างละเอียดใน [addschema.md](./addschema.md)

## 11. ตารางจำเร็ว

| ต้องการ | Syntax หลัก |
| --- | --- |
| เพิ่มตาราง | `model ชื่อ { ... }` |
| ฟิลด์ที่ยอมให้เป็น null | `String?`, `Int?` |
| เลข ID อัตโนมัติ | `Int @id @default(autoincrement())` |
| ค่าไม่ซ้ำ | `@unique` |
| คู่ค่าไม่ซ้ำ | `@@unique([fieldA, fieldB])` |
| เวลาเริ่มต้น | `DateTime @default(now())` |
| เวลาที่ Prisma จัดการเมื่อแก้ไข | `DateTime @updatedAt` |
| หนึ่ง–หนึ่ง | relation เดี่ยว และ Foreign Key มี `@unique` |
| หนึ่ง–หลาย | relation แบบ `[]` ฝั่งแม่ และ Foreign Key ฝั่งลูก |
| หลาย–หลาย | relation แบบ `[]` ทั้งสองฝั่ง หรือประกาศ Model ตารางกลาง |
| เปลี่ยนชื่อคอลัมน์ที่แมป | `@map("column_name")` |
| เปลี่ยนชื่อตารางที่แมป | `@@map("table_name")` |

## แหล่งอ้างอิง

อ้างอิงเอกสาร **Prisma ORM v6** เพื่อให้ตรงกับเวอร์ชันในโปรเจกต์:

- [Prisma Schema Reference](https://docs.prisma.io/docs/orm/v6/reference/prisma-schema-reference): ชนิดข้อมูลและ attributes
- [One-to-One Relations](https://www.prisma.io/docs/orm/v6/prisma-schema/data-model/relations/one-to-one-relations): relation เดี่ยวและ unique Foreign Key
- [One-to-Many Relations](https://www.prisma.io/docs/orm/v6/prisma-schema/data-model/relations/one-to-many-relations): relation แบบรายการ
- [Many-to-Many Relations](https://docs.prisma.io/docs/orm/v6/prisma-schema/data-model/relations/many-to-many-relations): ตารางกลาง implicit และ explicit
- [Referential Actions](https://www.prisma.io/docs/orm/v6/prisma-schema/data-model/relations/referential-actions): ผลของการลบข้อมูลที่มีความสัมพันธ์
- [Database Mapping](https://www.prisma.io/docs/orm/v6/prisma-schema/data-model/database-mapping): การแมปชื่อ Model และฟิลด์

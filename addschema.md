# วิธีแก้ Schema และไฟล์ที่ต้องแก้ตาม

โปรเจกต์นี้ใช้ NestJS ร่วมกับ Prisma 6 และ SQLite โดยกำหนดโครงสร้างฐานข้อมูลใน `prisma/schema.prisma` มี Model `Book` และ `Review`

การแก้ไฟล์ schema เป็นการแก้คำอธิบายโครงสร้าง ยังไม่ได้เปลี่ยนฐานข้อมูลจริง ต้องอัปเดตฐานข้อมูลด้วย migration และสร้าง Prisma Client ให้ตรงกันด้วย

## ตัวอย่าง: เพิ่มคอลัมน์ category ใน Book

ตัวอย่างนี้เพิ่มหมวดหมู่หนังสือที่เว้นว่างได้ โดยต้องแก้ 4 ไฟล์หลักตามด้านล่าง เนื้อหาในเอกสารเป็นตัวอย่าง ยังไม่ได้เพิ่มคอลัมน์ลงในโค้ดหรือฐานข้อมูลจริง

### 1. แก้ prisma/schema.prisma

เพิ่ม `category String?` ใน `model Book`:

```prisma
model Book {
  id          Int      @id @default(autoincrement())
  title       String
  author      String
  publishedAt DateTime @default(now())
  coverUrl    String?
  category    String?
  reviews     Review[]
}
```

- `String` คือชนิดข้อความ
- `?` อนุญาตให้คอลัมน์เป็น `null` หนังสือเดิมจึงยังไม่มีหมวดหมู่ได้
- ถ้าเพิ่มฟิลด์บังคับในตารางที่มีข้อมูลแล้ว ต้องกำหนดค่าเริ่มต้นที่เหมาะสม หรือเพิ่มแบบ nullable ก่อน เติมข้อมูลเดิม แล้วค่อยเปลี่ยนเป็นฟิลด์บังคับ

### 2. แก้ src/books/dto/create-book.dto.ts

เพิ่มฟิลด์ที่ต้องการรับจาก API:

```ts
export class CreateBookDto {
  title!: string;
  author!: string;
  publishedAt?: Date | string;
  coverUrl?: string | null;
  category?: string | null;
}
```

`category?` หมายถึงไม่จำเป็นต้องส่งฟิลด์นี้ ส่วน `| null` อนุญาตให้ส่ง `null` เพื่อระบุว่าไม่มีหมวดหมู่

ไม่ต้องเพิ่มฟิลด์ซ้ำใน `src/books/dto/update-book.dto.ts` เพราะใช้ `PartialType(CreateBookDto)` อยู่แล้ว ทำให้ทุกฟิลด์เป็น optional สำหรับการแก้ไข

หมายเหตุ: DTO ปัจจุบันกำหนดชนิดข้อมูลใน TypeScript ยังไม่ได้ตรวจข้อมูล request ตอนรันจริงโดยอัตโนมัติ หากต้องการ validation ต้องเพิ่มตัวตรวจและตั้งค่าการใช้งานแยกต่างหาก

### 3. แก้ src/books/books.service.ts

Service ปัจจุบันเลือกฟิลด์ที่จะบันทึกอย่างชัดเจน จึงต้องเพิ่ม `category` ทั้งใน `create()` และ `update()` การเพิ่มเฉพาะ DTO ยังไม่ทำให้ฟิลด์ถูกบันทึก

ใน `create()` เพิ่มบรรทัดนี้ภายใน `data` ข้างฟิลด์ `coverUrl`:

```ts
category: createBookDto.category ?? null,
```

ถ้าไม่ส่งหมวดหมู่หรือส่ง `null` จะบันทึกเป็น `null`

ใน `update()` เพิ่มส่วนนี้ภายใน `data`:

```ts
...(updateBookDto.category !== undefined && {
  category: updateBookDto.category,
}),
```

พฤติกรรมของการแก้ไข:

| ข้อมูลที่ส่ง | ผลลัพธ์ |
| --- | --- |
| ไม่ส่ง `category` | เก็บค่าเดิมไว้ |
| `"category": "นิยาย"` | เปลี่ยนหมวดหมู่เป็นนิยาย |
| `"category": null` | ล้างหมวดหมู่เป็น `null` |
| `"category": ""` | บันทึกเป็นข้อความว่างตามโค้ดปัจจุบัน |

### 4. แก้ src/books/entities/book.entity.ts

เพิ่มฟิลด์ใน interface `Book`:

```ts
category: string | null;
```

ไฟล์นี้เป็น interface ของ TypeScript การแก้ไฟล์นี้ไม่ได้สร้างหรือเปลี่ยนคอลัมน์ในฐานข้อมูล

## อัปเดตฐานข้อมูลและ Prisma Client

### ตรวจฐานข้อมูลและสำรองข้อมูลก่อน

Schema อ่านตำแหน่งฐานข้อมูลจาก `DATABASE_URL` สำหรับ SQLite หากใช้ค่า `file:./dev.db` จะอ้างถึงไฟล์ `prisma/dev.db` เนื่องจาก schema อยู่ในโฟลเดอร์ `prisma`

ตรวจว่าตัวแปรชี้ไปยังฐานข้อมูลสำหรับพัฒนาที่ต้องการจริง จากนั้นหยุดเซิร์ฟเวอร์และโปรแกรมที่กำลังเขียนฐานข้อมูลก่อนสำรองไฟล์ ตัวอย่างเมื่อใช้ `prisma/dev.db` รันจากโฟลเดอร์หลักของโปรเจกต์:

```powershell
$schemaBackupStamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
Copy-Item -LiteralPath ./prisma/dev.db -Destination "./prisma/dev.db.$schemaBackupStamp.bak"
```

หาก `DATABASE_URL` ชี้ไฟล์อื่น ให้สำรองไฟล์นั้นแทน และอย่า commit ไฟล์สำรองที่มีข้อมูลส่วนตัวลง Git

### รัน migration สำหรับเครื่องพัฒนา

```powershell
npx prisma validate
npx prisma migrate dev --name add_book_category
npx prisma generate
npm run build
```

- `validate` ตรวจความถูกต้องของ schema
- `migrate dev` สร้างประวัติการเปลี่ยนโครงสร้างใน `prisma/migrations` และนำไปใช้กับฐานข้อมูลสำหรับพัฒนา
- `generate` สร้าง Prisma Client และชนิดข้อมูลให้ตรงกับ schema
- `build` ตรวจว่าโค้ด TypeScript คอมไพล์ได้

**สำคัญสำหรับงานนี้:** ตอนเขียนเอกสารมี `prisma/dev.db` แต่ยังไม่มีโฟลเดอร์ `prisma/migrations` จึงอาจพบปัญหาโครงสร้างเดิมไม่ตรงกับประวัติ migrations หากคำสั่งขอ reset อย่าเพิ่งตอบตกลง เพราะจะลบข้อมูล ต้องสำรองและจัดทำ baseline ให้ตรงกับฐานข้อมูลเดิมก่อน หากต้องการเก็บข้อมูลไว้

อย่าแก้หรือลบ migration ที่ใช้ไปแล้วเพื่อเปลี่ยนประวัติ ให้สร้าง migration ใหม่สำหรับการเปลี่ยนแปลงครั้งถัดไป และเก็บ schema กับ migration ที่สร้างไว้ใน Git

`migrate dev` ใช้สำหรับการพัฒนา สำหรับ production ให้ตรวจ migration ที่สร้างและทดสอบแล้ว จากนั้นใช้ `npx prisma migrate deploy` พร้อมแผนสำรองข้อมูล

## ทดสอบผ่าน API

เริ่มเซิร์ฟเวอร์:

```powershell
npm run start:dev
```

ค่า port เริ่มต้นของโปรเจกต์คือ `5000` หากตั้ง `PORT` ไว้ ให้ใช้ค่านั้นแทน

### เพิ่มหนังสือ

ส่ง `POST http://localhost:5000/books` โดยเลือก Body เป็น JSON และใช้ `Content-Type: application/json`:

```json
{
  "title": "เจ้าชายน้อย",
  "author": "Antoine de Saint-Exupéry",
  "category": "นิยาย"
}
```

ตรวจว่าผลลัพธ์มี `category` ตามที่ส่ง และจด `id` ที่ได้รับไว้

### แก้ไขหนังสือ

ส่ง `PATCH http://localhost:5000/books/<id>` โดยแทน `<id>` ด้วยเลขหนังสือจริง:

```json
{
  "category": "วรรณกรรม"
}
```

ตรวจเพิ่มเติมดังนี้:

1. เรียก `GET /books/<id>` แล้วได้หมวดหมู่ใหม่
2. แก้เฉพาะ `title` โดยไม่ส่ง `category` แล้วหมวดหมู่ยังเป็นค่าเดิม
3. ส่ง `"category": null` แล้วหมวดหมู่ถูกล้าง
4. เพิ่มหนังสือโดยไม่ส่ง `category` แล้วสร้างได้ โดยหมวดหมู่เป็น `null`
5. ตรวจว่าการอ่านรายการหนังสือพร้อมรีวิวยังทำงานได้

Controller และคำสั่งอ่านปัจจุบันไม่ต้องแก้สำหรับตัวอย่างนี้ เพราะ Controller ส่ง DTO ต่อให้ Service และ Prisma คืน scalar fields ทั้งหมดอยู่แล้ว หากภายหลังใช้ `select` หรือแปลง response เอง ต้องเพิ่มฟิลด์ในส่วนเหล่านั้นด้วย

## ถ้าเปลี่ยน Schema แบบอื่น

| การเปลี่ยนแปลง | สิ่งที่ต้องพิจารณา |
| --- | --- |
| เพิ่มคอลัมน์ | แก้ schema, DTO, Service และ interface ตามการใช้งานจริง แล้วสร้าง migration |
| เปลี่ยนชื่อคอลัมน์ | แก้ชื่ออ้างอิงในโค้ดและผู้เรียก API ตรวจ SQL migration ก่อนใช้ เพราะอาจถูกตีความเป็นลบคอลัมน์เดิมแล้วเพิ่มใหม่ |
| เปลี่ยนชนิดข้อมูล | ปรับชนิดใน DTO/interface และการแปลงค่าใน Service พร้อมตรวจว่าข้อมูลเดิมแปลงได้ |
| ลบคอลัมน์ | เอาการอ้างอิงออกจากโค้ดและผู้เรียก API พร้อมสำรองข้อมูล เพราะข้อมูลในคอลัมน์จะถูกลบ |
| เพิ่มหรือแก้ relation | ปรับ relation และ foreign key ใน schema รวมถึงคำสั่งบันทึก/อ่าน และตรวจผลของการลบข้อมูลที่เกี่ยวข้อง |

ถ้าเปลี่ยนชื่อคอลัมน์หรือแปลงข้อมูลซับซ้อน สามารถใช้ `npx prisma migrate dev --create-only --name describe_change` เพื่อสร้าง migration สำหรับตรวจและปรับ SQL ก่อนนำไปใช้ ทั้งนี้ต้องจัดการประวัติ migration ของฐานข้อมูลเดิมให้เรียบร้อยก่อน

ไม่จำเป็นต้องเปิดทุกคอลัมน์ให้ API รับค่า เช่น `id` ที่ฐานข้อมูลสร้างเอง ควรปรับ DTO และ Service เฉพาะฟิลด์ที่อนุญาตให้ผู้ใช้ส่งมา

## สรุปลำดับการทำงาน

สำรองฐานข้อมูล → แก้ schema → แก้ DTO → แก้ Service → แก้ interface → ตรวจและรัน migration → generate → build → รีสตาร์ตและทดสอบ API

เอกสารอ้างอิงสำหรับ Prisma 6:

- [Development and production](https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production)
- [Baselining an existing database](https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/baselining)

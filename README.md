<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

----------------------------------------------------------------------------------------------------------------------------------------------------

## สรุปความรู้ที่ได้

1.TypeScript คือภาษาที่เอา JavaScript มาติดเกราะเพิ่มความเข้มงวดเรื่อง "ชนิดข้อมูล" (Static Typing) ช่วยให้เราตรวจเจอ bug ได้ตั้งแต่ตอนเขียนโค้ดก่อนที่จะรันโปรแกรมจริง

Variable: การประกาศตัวแปรต้องระบุประเภทให้ชัดเจน เช่น string, number, boolean ทำให้เราไม่สามารถเผลอเอาตัวอักษรไปใส่ในตัวแปรที่เก็บตัวเลขได้

ตัวอย่าง: let name: string = "Folk";

Function: สามารถกำหนดประเภทข้อมูลของ Parameters และ Return Type ได้ ทำให้รู้ทันทีว่าฟังก์ชันนี้ต้องการอะไรและจะคืนค่าอะไรกลับมา

ตัวอย่าง: function calculate(price: number): number { ... }

Class: เปรียบเสมือนแม่พิมพ์สำหรับสร้าง Object รองรับ OOP เต็มรูปแบบ มีทั้ง constructor, public, private 

2. สรุปกลไกการทำงานของ Async / Await และ Promise
ในการเขียนเว็บ การดึงข้อมูลจากฐานข้อมูลหรือ API จะต้องใช้เวลารอ จึงต้องมีกลไกมารองรับการรอคอยนี้:

Promise : Object ที่เป็นตัวแทนของผลลัพธ์ของงานที่ยังทำไม่เสร็จในตอนนี้ แต่สัญญาว่าจะคืนผลลัพธ์มาให้ในอนาคต โดยจะมี 3 สถานะ:

Pending: ระบบกำลังดึงข้อมูล

Fulfilled (Resolved): ได้ข้อมูลกลับมาพร้อมใช้งาน

Rejected: เกิด Error

Async / Await :
เป็นรูปแบบการเขียน (Syntactic Sugar) ที่เอามาครอบ Promise ไว้ เพื่อให้เราเขียนโค้ดแบบรอคอย ให้ออกมาหน้าตาเหมือนโค้ดทำงานตามลำดับปกติ (Synchronous) โดย:

ใส่ async ไว้หน้าฟังก์ชัน เพื่อบอกว่าฟังก์ชันนี้มีการทำงานแบบไม่พร้อมกัน

ใส่ await ไว้หน้าคำสั่งที่ต้องรอ (เช่น await this.repository.save()) ระบบจะหยุดรอตรงบรรทัดนั้นจนกว่าจะทำงานเสร็จ แล้วค่อยขยับไปทำบรรทัดถัดไป

3. สรุปคอนเซปต์การทำ CRUD API ด้วย NestJS
NestJS คือ Framework สำหรับทำระบบหลังบ้าน (Backend) ที่มีโครงสร้างเป็นระเบียบมาก (Architecture) คอนเซปต์หลักของการทำ CRUD มีดังนี้:

3.1 โครงสร้างการทำงาน (Controller > Service > Repository):

Controller: คอยรับ Request จาก Postman ว่าผู้ใช้ยิง HTTP Method อะไรมา (@Get, @Post, @Put, @Delete)

Service: เขียนโค้ด Business Logic ต่าง ๆ ไว้ที่นี่

Repository (ผ่าน TypeORM): เอาข้อมูลจาก Service ไปบันทึก, แก้ไข, ดึง, หรือลบ ออกจากตารางในฐานข้อมูล MySQL

3.2 การใช้ DTO และ Entity:

Entity (book.entity.ts): ตัวแทนของ "ตารางในฐานข้อมูล" ใช้ @Column() เพื่อกำหนดฟิลด์ต่าง ๆ 

DTO (create-book.dto.ts): ตัวแทนของ "กล่องรับพัสดุ" ใช้กรองและกำหนดสเปกข้อมูลที่ผู้ใช้ยิงเข้ามาจาก Postman ป้องกันคนส่งข้อมูลมั่ว ๆ เข้ามาในระบบ

3.3 แมปปิ้ง CRUD กับ HTTP Methods:

C (Create) ยิง POST: เพื่อเพิ่มข้อมูลใหม่

R (Read) ยิง GET: เพื่อดึงข้อมูลทั้งหมด หรือดึงเฉพาะ ID ที่ต้องการ

U (Update) ยิง PUT / PATCH: เพื่อแก้ไขข้อมูลเดิม

D (Delete) ยิง DELETE: เพื่อลบข้อมูลทิ้ง

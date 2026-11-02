import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // เปิดรับทุกการเชื่อมต่อชั่วคราวเพื่อเทส
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

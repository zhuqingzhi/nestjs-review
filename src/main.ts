import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j2';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('会议管理系统')
    .setDescription('会议管理系统v1')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  /*  knife4jSetup(app, [
    {
      name: '会议管理系统',
      url: `/api-json`,
      swaggerVersion: '2.0',
      location: `/api-json`,
    },
  ]); */
  await app.listen(1024);
}
bootstrap();

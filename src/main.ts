import { BaseExceptionFilter, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Quantum Leap')
    .setDescription('We are a technology solutions company. We solve selected problems by using the latest Ai, IoT, Software Engineering and Blockchain technologies. We operate on both the B2B, B2C and Government sectors.')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${process.env.PORT || 3333}`)
    .addServer('https://quleap.herokuapp.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const redocOptions: RedocOptions = {
    title: 'Quantum Leap',
    logo: {
      url: 'https://media-exp1.licdn.com/dms/image/C4D0BAQFBXHy_5kuJJA/company-logo_200_200/0/1635843003415?e=1668643200&v=beta&t=cyCuqKrPIfMsPEE3Ixjr8PPS7N9-AKF4qqgk8cpdepo',
      backgroundColor: '#F0F0F0',
      altText: 'Quantum Leap'
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    tagGroups: [
      {
        name: 'Auth',
        tags: ['Auth'],
      },
      {
        name: 'User',
        tags: ['User'],
      },
      {
        name: 'Plan',
        tags: ['Plan'],
      },
      {
        name: 'Song',
        tags: ['Song'],
      },

    ],
  };
  //@ts-ignore
  await RedocModule.setup('/docs', app, document, redocOptions);

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
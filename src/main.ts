import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationExceptionFilter } from './Filters/custom-validation-exception.filter';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new CustomValidationExceptionFilter());
  const yamlPath = path.resolve(process.cwd(), 'Transaction.swagger.yaml');
  const file = fs.readFileSync(yamlPath, 'utf8');

  const swaggerDocument = YAML.parse(file);
  SwaggerModule.setup('docs', app, swaggerDocument);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

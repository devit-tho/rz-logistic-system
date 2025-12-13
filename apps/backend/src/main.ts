import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { EnvSchema } from './config/env.schema';

// --------------------------------------------------------------------------------

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvSchema>);

  const PORT = Number(configService.get('PORT'));

  app.setGlobalPrefix('/api/v1');
  app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Logistic API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);

  await app.listen(PORT);
}
bootstrap();

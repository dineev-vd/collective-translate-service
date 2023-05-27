import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
// smewhere in your initialization fi

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 10000, host: 'crud' },
  });
  app.use(cookieParser());

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();

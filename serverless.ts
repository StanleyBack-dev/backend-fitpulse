import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { createServer, IncomingMessage, ServerResponse } from 'http';

let server: ReturnType<typeof createServer>;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    const config = app.get(ConfigService);
    const corsOptions = config.get('cors');
    app.enableCors(corsOptions);

    await app.init();

    server = createServer(app.getHttpAdapter().getInstance());
  }

  return server.emit('request', req, res);
}
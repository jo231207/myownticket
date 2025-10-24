import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectPrisma, disconnectPrisma } from './config/prisma';

const signals: Array<NodeJS.Signals> = ['SIGINT', 'SIGTERM', 'SIGUSR2'];

const bootstrap = async (): Promise<void> => {
  await connectPrisma();

  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`[server] listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    console.log(`[server] received ${signal}, shutting down gracefully`);
    server.close(async (error) => {
      if (error) {
        console.error('[server] error while closing HTTP server', error);
        process.exit(1);
      }
      await disconnectPrisma();
      process.exit(0);
    });
  };

  signals.forEach((signal) => {
    process.on(signal, () => {
      void shutdown(signal);
    });
  });
};

bootstrap().catch(async (error: unknown) => {
  console.error('[server] failed to start', error);
  await disconnectPrisma();
  process.exit(1);
});

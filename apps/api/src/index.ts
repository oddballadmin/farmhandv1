import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createApiRouter } from './routes.js';
import http from 'node:http';

// Create and configure the Express app
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Friendly root route
  app.get('/', (_req, res) => {
    res.type('text').send('Farm API up. Try GET /api/health');
  });

  app.use('/api', createApiRouter());

  // Not found handler for API
  app.use('/api', (_req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    res.status(status).json({ error: err?.message || 'Internal Server Error' });
  });

  return app;
}

const isTest = Boolean((import.meta as any).vitest || process.env.VITEST || process.env.VITEST_WORKER_ID);
if (!isTest) {
  const app = createApp();
  const preferred = Number(process.env.PORT) || 3001;
  const server = http.createServer(app);
  server.on('error', (err: any) => {
    if (err?.code === 'EADDRINUSE') {
      // Try random free port
      const fallback = http.createServer(app);
      fallback.listen(0, () => {
        const addr = fallback.address();
        const port = typeof addr === 'object' && addr ? addr.port : preferred;
        console.log(`[api] port ${preferred} in use; listening on http://localhost:${port}`);
      });
    } else {
      throw err;
    }
  });
  server.listen(preferred, () => {
    console.log(`[api] listening on http://localhost:${preferred}`);
  });
}

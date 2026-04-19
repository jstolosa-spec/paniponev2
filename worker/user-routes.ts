import { Hono } from "hono";
import type { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/migration-status', (c) => {
    return c.json({ 
      success: true, 
      message: 'System is currently transitioning to Firebase for data persistence.',
      worker_status: 'standby'
    });
  });
}
import { Hono } from 'hono';
import { Env } from './core-utils';
/**
 * PanipuanConnect Worker Routes (Decommissioned)
 * Application now utilizes Vanilla SPA architecture with static delivery.
 */
export const userRoutes = (app: Hono<{ Bindings: Env }>) => {
  app.get('/api/v1/info', (c) => {
    return c.json({
      name: "PanipuanConnect",
      version: "2.0.0",
      status: "decommissioned-in-favor-of-spa"
    });
  });
};
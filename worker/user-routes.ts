import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, DirectoryEntity, OfficialEntity, AnnouncementEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'PanipuanConnect API' }}));
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    if (username === 'admin' && password === 'admin123') {
      return ok(c, { token: 'mock-jwt-token', user: { id: 'admin-1', name: 'Barangay Admin' } });
    }
    return bad(c, 'Invalid credentials');
  });
  // DIRECTORY
  app.get('/api/directory', async (c) => {
    await DirectoryEntity.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const data = await DirectoryEntity.list(c.env, cursor ?? null, limit ? Number(limit) : 50);
    return ok(c, data);
  });
  app.post('/api/directory', async (c) => {
    const body = await c.req.json();
    const item = await DirectoryEntity.create(c.env, { ...body, id: crypto.randomUUID() });
    return ok(c, item);
  });
  app.put('/api/directory/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const entity = new DirectoryEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    await entity.save({ ...body, id });
    return ok(c, await entity.getState());
  });
  app.delete('/api/directory/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await DirectoryEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // OFFICIALS
  app.get('/api/officials', async (c) => {
    await OfficialEntity.ensureSeed(c.env);
    const data = await OfficialEntity.list(c.env, null, 20);
    return ok(c, data);
  });
  app.post('/api/officials', async (c) => {
    const body = await c.req.json();
    const item = await OfficialEntity.create(c.env, { ...body, id: crypto.randomUUID() });
    return ok(c, item);
  });
  app.put('/api/officials/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const entity = new OfficialEntity(c.env, id);
    await entity.save({ ...body, id });
    return ok(c, await entity.getState());
  });
  app.delete('/api/officials/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await OfficialEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // ANNOUNCEMENTS
  app.get('/api/announcements', async (c) => {
    await AnnouncementEntity.ensureSeed(c.env);
    const data = await AnnouncementEntity.list(c.env, null, 20);
    return ok(c, data);
  });
  app.post('/api/announcements', async (c) => {
    const body = await c.req.json();
    const item = await AnnouncementEntity.create(c.env, { ...body, id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] });
    return ok(c, item);
  });
  app.delete('/api/announcements/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await AnnouncementEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // USERS (Template default)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
}
import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity, DirectoryEntity, OfficialEntity, AnnouncementEntity,
  ResidentEntity, AppointmentEntity, SkilledWorkerEntity, JobPostingEntity
} from "./entities";
import { ok, bad } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ANNOUNCEMENTS
  app.get('/api/announcements', async (c) => { 
    await AnnouncementEntity.ensureSeed(c.env); 
    return ok(c, await AnnouncementEntity.list(c.env)); 
  });
  app.post('/api/announcements', async (c) => {
    const body = await c.req.json();
    const item = await AnnouncementEntity.create(c.env, { ...body, id: crypto.randomUUID() });
    return ok(c, item);
  });
  app.put('/api/announcements/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const entity = new AnnouncementEntity(c.env, id);
    await entity.save({ ...body, id });
    return ok(c, await entity.getState());
  });
  app.delete('/api/announcements/:id', async (c) => {
    const success = await AnnouncementEntity.delete(c.env, c.req.param('id'));
    return ok(c, { success });
  });
  // DIRECTORY
  app.get('/api/directory', async (c) => { 
    await DirectoryEntity.ensureSeed(c.env); 
    return ok(c, await DirectoryEntity.list(c.env)); 
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
    await entity.save({ ...body, id });
    return ok(c, await entity.getState());
  });
  app.delete('/api/directory/:id', async (c) => {
    const success = await DirectoryEntity.delete(c.env, c.req.param('id'));
    return ok(c, { success });
  });
  // OFFICIALS
  app.get('/api/officials', async (c) => { 
    await OfficialEntity.ensureSeed(c.env); 
    return ok(c, await OfficialEntity.list(c.env)); 
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
    const success = await OfficialEntity.delete(c.env, c.req.param('id'));
    return ok(c, { success });
  });
  // JOBS
  app.get('/api/jobs', async (c) => { 
    await JobPostingEntity.ensureSeed(c.env); 
    return ok(c, await JobPostingEntity.list(c.env)); 
  });
  app.post('/api/jobs', async (c) => {
    const body = await c.req.json();
    const item = await JobPostingEntity.create(c.env, { ...body, id: crypto.randomUUID() });
    return ok(c, item);
  });
  app.put('/api/jobs/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const entity = new JobPostingEntity(c.env, id);
    await entity.save({ ...body, id });
    return ok(c, await entity.getState());
  });
  app.delete('/api/jobs/:id', async (c) => {
    const success = await JobPostingEntity.delete(c.env, c.req.param('id'));
    return ok(c, { success });
  });
  // SKILLS
  app.get('/api/skills', async (c) => { 
    await SkilledWorkerEntity.ensureSeed(c.env); 
    return ok(c, await SkilledWorkerEntity.list(c.env)); 
  });
  app.put('/api/skills/:id/verify', async (c) => {
    const id = c.req.param('id');
    const entity = new SkilledWorkerEntity(c.env, id);
    const state = await entity.getState();
    await entity.save({ ...state, isVerified: !state.isVerified });
    return ok(c, await entity.getState());
  });
  // RESIDENTS & APPOINTMENTS (Existing)
  app.get('/api/residents', async (c) => { await ResidentEntity.ensureSeed(c.env); return ok(c, await ResidentEntity.list(c.env)); });
  app.get('/api/appointments', async (c) => { await AppointmentEntity.ensureSeed(c.env); return ok(c, await AppointmentEntity.list(c.env)); });
  app.post('/api/appointments', async (c) => {
    const body = await c.req.json();
    const item = await AppointmentEntity.create(c.env, { ...body, id: crypto.randomUUID(), status: 'pending' });
    return ok(c, item);
  });
  app.put('/api/appointments/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const entity = new AppointmentEntity(c.env, id);
    await entity.save({ ...body, id });
    return ok(c, await entity.getState());
  });
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    if (username === 'admin' && password === 'admin123') return ok(c, { user: { id: 'admin-1', name: 'Barangay Admin' } });
    return bad(c, 'Invalid credentials');
  });
}
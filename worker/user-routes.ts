import { Hono } from "hono";
import type { Env } from './core-utils';
import { 
  UserEntity, DirectoryEntity, OfficialEntity, AnnouncementEntity,
  ResidentEntity, AppointmentEntity, SkilledWorkerEntity, JobPostingEntity 
} from "./entities";
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // DIRECTORY & ANNOUNCEMENTS & OFFICIALS (Existing)
  app.get('/api/directory', async (c) => { await DirectoryEntity.ensureSeed(c.env); return ok(c, await DirectoryEntity.list(c.env)); });
  app.get('/api/announcements', async (c) => { await AnnouncementEntity.ensureSeed(c.env); return ok(c, await AnnouncementEntity.list(c.env)); });
  app.get('/api/officials', async (c) => { await OfficialEntity.ensureSeed(c.env); return ok(c, await OfficialEntity.list(c.env)); });
  // RESIDENTS
  app.get('/api/residents', async (c) => {
    await ResidentEntity.ensureSeed(c.env);
    return ok(c, await ResidentEntity.list(c.env));
  });
  // APPOINTMENTS
  app.get('/api/appointments', async (c) => {
    await AppointmentEntity.ensureSeed(c.env);
    return ok(c, await AppointmentEntity.list(c.env));
  });
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
  // SKILLS & JOBS
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
  app.get('/api/jobs', async (c) => {
    await JobPostingEntity.ensureSeed(c.env);
    return ok(c, await JobPostingEntity.list(c.env));
  });
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    if (username === 'admin' && password === 'admin123') return ok(c, { user: { id: 'admin-1', name: 'Barangay Admin' } });
    return bad(c, 'Invalid credentials');
  });
}
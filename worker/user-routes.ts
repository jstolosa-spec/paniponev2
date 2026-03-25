import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity, DirectoryEntity, OfficialEntity, AnnouncementEntity,
  ResidentEntity, AppointmentEntity, SkilledWorkerEntity, JobPostingEntity,
  BlotterReportEntity, LuponCaseEntity
} from "./entities";
import { ok, bad } from './core-utils';
import type { UserRole } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ANNOUNCEMENTS
  app.get('/api/announcements', async (c) => {
    await AnnouncementEntity.ensureSeed(c.env);
    return ok(c, await AnnouncementEntity.list(c.env));
  });
  app.delete('/api/announcements/:id', async (c) => {
    const id = c.req.param('id');
    await AnnouncementEntity.delete(c.env, id);
    return ok(c, { id });
  });
  // BLOTTER
  app.get('/api/blotter', async (c) => {
    return ok(c, await BlotterReportEntity.list(c.env));
  });
  app.post('/api/blotter', async (c) => {
    const body = await c.req.json();
    const item = await BlotterReportEntity.create(c.env, { ...body, id: crypto.randomUUID() });
    return ok(c, item);
  });
  app.delete('/api/blotter/:id', async (c) => {
    const id = c.req.param('id');
    await BlotterReportEntity.delete(c.env, id);
    return ok(c, { id });
  });
  // LUPON
  app.get('/api/lupon', async (c) => {
    return ok(c, await LuponCaseEntity.list(c.env));
  });
  app.post('/api/lupon', async (c) => {
    const body = await c.req.json();
    const item = await LuponCaseEntity.create(c.env, { ...body, id: crypto.randomUUID(), summonsGenerated: false });
    return ok(c, item);
  });
  app.put('/api/lupon/:id/summons', async (c) => {
    const id = c.req.param('id');
    const entity = new LuponCaseEntity(c.env, id);
    const state = await entity.getState();
    await entity.save({ ...state, summonsGenerated: true });
    return ok(c, await entity.getState());
  });
  app.delete('/api/lupon/:id', async (c) => {
    const id = c.req.param('id');
    await LuponCaseEntity.delete(c.env, id);
    return ok(c, { id });
  });
  // RESIDENTS
  app.get('/api/residents', async (c) => {
    await ResidentEntity.ensureSeed(c.env);
    return ok(c, await ResidentEntity.list(c.env));
  });
  app.post('/api/residents/register', async (c) => {
    const body = await c.req.json();
    const item = await ResidentEntity.create(c.env, {
      ...body,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
      residencyStatus: false
    });
    return ok(c, item);
  });
  app.put('/api/residents/:id/verify', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const entity = new ResidentEntity(c.env, id);
    const state = await entity.getState();
    await entity.save({ ...state, verificationStatus: status });
    return ok(c, await entity.getState());
  });
  // DIRECTORY
  app.get('/api/directory', async (c) => {
    await DirectoryEntity.ensureSeed(c.env);
    return ok(c, await DirectoryEntity.list(c.env));
  });
  app.delete('/api/directory/:id', async (c) => {
    const id = c.req.param('id');
    await DirectoryEntity.delete(c.env, id);
    return ok(c, { id });
  });
  // OTHERS
  app.get('/api/officials', async (c) => {
    await OfficialEntity.ensureSeed(c.env);
    return ok(c, await OfficialEntity.list(c.env));
  });
  app.get('/api/jobs', async (c) => {
    await JobPostingEntity.ensureSeed(c.env);
    return ok(c, await JobPostingEntity.list(c.env));
  });
  app.get('/api/skills', async (c) => {
    await SkilledWorkerEntity.ensureSeed(c.env);
    return ok(c, await SkilledWorkerEntity.list(c.env));
  });
  app.get('/api/appointments', async (c) => {
    await AppointmentEntity.ensureSeed(c.env);
    return ok(c, await AppointmentEntity.list(c.env));
  });
  app.post('/api/appointments', async (c) => {
    const body = await c.req.json();
    const list = await AppointmentEntity.list(c.env);
    const queueNumber = (list.items.length || 0) + 1;
    const item = await AppointmentEntity.create(c.env, {
      ...body,
      id: crypto.randomUUID(),
      status: 'pending',
      queueNumber,
      estimatedWaitTime: '15-30 mins'
    });
    return ok(c, item);
  });
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    if (username === 'admin' && password === 'admin123') {
      return ok(c, { user: { id: 'admin-1', name: 'Barangay Admin', role: 'superAdmin' as UserRole } });
    }
    if (username === 'secretary' && password === 'sec123') {
      return ok(c, { user: { id: 'sec-1', name: 'Barangay Secretary', role: 'secretary' as UserRole } });
    }
    if (username === 'resident' && password === 'res123') {
      return ok(c, { user: { id: 'res-user-1', name: 'Juan Resident', role: 'resident' as UserRole, residentId: 'res-1' } });
    }
    return bad(c, 'Invalid credentials');
  });
}
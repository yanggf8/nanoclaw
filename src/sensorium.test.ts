// src/sensorium.test.ts
import { describe, it, expect } from 'vitest';
import { buildSensorium, SensoriumInput } from './sensorium.js';

describe('buildSensorium', () => {
  const base: SensoriumInput = {
    now: new Date('2026-04-09T14:32:00.000Z'),
    startedAt: new Date('2026-04-09T11:20:00.000Z'),
    activeSessions: 2,
    pendingTasks: 3,
    overdueTasks: 1,
    recentErrors: 0,
  };

  it('includes current ISO time', () => {
    const result = buildSensorium(base);
    expect(result).toContain('<time>2026-04-09T14:32:00.000Z</time>');
  });

  it('calculates uptime in hours rounded to 1 decimal', () => {
    const result = buildSensorium(base);
    // 14:32 - 11:20 = 3h 12m = 3.2h
    expect(result).toContain('<uptime_hours>3.2</uptime_hours>');
  });

  it('includes active sessions count', () => {
    const result = buildSensorium(base);
    expect(result).toContain('<sessions_active>2</sessions_active>');
  });

  it('includes pending tasks count', () => {
    const result = buildSensorium(base);
    expect(result).toContain('<tasks_pending>3</tasks_pending>');
  });

  it('includes overdue tasks count', () => {
    const result = buildSensorium(base);
    expect(result).toContain('<tasks_overdue>1</tasks_overdue>');
  });

  it('includes recent errors count', () => {
    const result = buildSensorium(base);
    expect(result).toContain('<recent_errors>0</recent_errors>');
  });

  it('wraps output in <sensorium> tags', () => {
    const result = buildSensorium(base);
    expect(result).toMatch(/^<sensorium>/);
    expect(result).toMatch(/<\/sensorium>$/);
  });

  it('handles zero uptime (started just now)', () => {
    const result = buildSensorium({ ...base, startedAt: base.now });
    expect(result).toContain('<uptime_hours>0.0</uptime_hours>');
  });

  it('handles zero active sessions', () => {
    const result = buildSensorium({ ...base, activeSessions: 0 });
    expect(result).toContain('<sessions_active>0</sessions_active>');
  });
});

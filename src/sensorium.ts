export interface SensoriumInput {
  now: Date;
  startedAt: Date;
  activeSessions: number;
  pendingTasks: number;
  overdueTasks: number;
  recentErrors: number;
}

/**
 * Build a compact XML sensorium block to inject into every agent prompt.
 *
 * Gives the agent ambient awareness of current time, uptime, pending tasks,
 * and recent error rate without requiring any tool calls.
 *
 * Inspired by Springdrift (arxiv:2604.04660) §4.2 "The Sensorium".
 */
export function buildSensorium(input: SensoriumInput): string {
  const uptimeMs = input.now.getTime() - input.startedAt.getTime();
  const uptimeHours = (uptimeMs / (1000 * 60 * 60)).toFixed(1);

  return [
    '<sensorium>',
    '  <clock>',
    `    <time>${input.now.toISOString()}</time>`,
    `    <uptime_hours>${uptimeHours}</uptime_hours>`,
    '  </clock>',
    '  <vitals>',
    `    <sessions_active>${input.activeSessions}</sessions_active>`,
    `    <tasks_pending>${input.pendingTasks}</tasks_pending>`,
    `    <tasks_overdue>${input.overdueTasks}</tasks_overdue>`,
    `    <recent_errors>${input.recentErrors}</recent_errors>`,
    '  </vitals>',
    '</sensorium>',
  ].join('\n');
}

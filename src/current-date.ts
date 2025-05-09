import * as core from '@actions/core';
import { format } from 'date-fns';

export function run() {
  try {
    const formatString = core.getInput('format');
    const now = new Date();
    const formatted = format(now, formatString);
    core.info(`Computed date: "${formatted}"`);
    core.setOutput('date', formatted);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

if (process.env.GITHUB_ACTIONS === 'true') {
  run(); // only auto-run inside GitHub
}

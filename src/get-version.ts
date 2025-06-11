import * as core from '@actions/core';
import { readFileSync } from 'node:fs';

export function run() {
  try {
    const filePath = core.getInput('path');
    const packageJson = JSON.parse(readFileSync(filePath, 'utf-8'));
    const { version } = packageJson;
    if (!version) {
      throw new Error(`Invalid version in '${filePath}'`);
    }

    core.info(`Found version: "${version}"`);
    core.setOutput('version', version);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

if (process.env.GITHUB_ACTIONS === 'true') {
  run(); // only auto-run inside GitHub
}

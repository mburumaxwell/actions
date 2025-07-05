import * as core from '@actions/core';
import { readFileSync } from 'node:fs';
import * as semver from 'semver';

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

    const parsed = semver.parse(version);
    if (!parsed) {
      throw new Error('Unable to parse version');
    }

    core.setOutput('major', parsed.major);
    core.setOutput('minor', parsed.minor);
    core.setOutput('patch', parsed.patch);
    core.setOutput('build', parsed.build);
    core.setOutput('prerelease', parsed.prerelease);

  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

if (process.env.GITHUB_ACTIONS === 'true') {
  run(); // only auto-run inside GitHub
}

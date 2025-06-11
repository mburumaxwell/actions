import * as core from '@actions/core';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import * as semver from 'semver';

function validateByte(num: number, label: string) {
  // Zephyr requires 0–255 range
  if (num < 0 || num > 255) {
    throw new Error(`${label} must be in range 0-255`);
  }
}

export function run() {
  try {
    const raw = core.getInput('version');
    const parsed = semver.parse(raw);
    if (!parsed) {
      throw new Error(`Invalid SemVer string: ${raw}`);
    }

    const tweak = parsed.build.length > 0 ? parseInt(parsed.build[0], 10) : 0;
    validateByte(parsed.major, 'Major');
    validateByte(parsed.minor, 'Minor');
    validateByte(parsed.patch, 'Patch');
    validateByte(tweak, 'Tweak');

    const extraversion =
      parsed.prerelease.length > 0
        ? parsed.prerelease
            .join('.')
            .toLowerCase()
            .replace(/[^a-z0-9.-]/g, '')
        : '';

    const lines = [
      `VERSION_MAJOR = ${parsed.major}`,
      `VERSION_MINOR = ${parsed.minor}`,
      `PATCHLEVEL = ${parsed.patch}`,
      `VERSION_TWEAK = ${tweak}`,
      `EXTRAVERSION = ${extraversion}`,
      '', // ensure newline
    ];

    const contents = lines.join('\n');
    const destination = core.getInput('destination');
    if (existsSync(destination)) rmSync(destination);
    writeFileSync(destination, contents, 'utf-8');
    core.info(`✅ Generated VERSION file for ${raw} at ${destination}`);
    core.setOutput('contents', contents);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

if (process.env.GITHUB_ACTIONS === 'true') {
  run(); // only auto-run inside GitHub
}

import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@actions/core', () => ({
  getInput: vi.fn((name: string) => process.env[`INPUT_${name.toUpperCase()}`] || ''),
  setOutput: vi.fn(),
  setFailed: vi.fn(),
  info: vi.fn(),
}));

import * as core from '@actions/core';
import { run } from '../src/get-version';

describe('get-version action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('works with valid path', () => {
    vi.stubEnv('INPUT_PATH', join(process.cwd(), 'tests/dummy.json'));

    run();

    expect(core.setOutput).toHaveBeenCalledWith('version', '3.1.0-alpha.4');
    expect(core.setOutput).toHaveBeenCalledWith('major', 3);
    expect(core.setOutput).toHaveBeenCalledWith('minor', 1);
    expect(core.setOutput).toHaveBeenCalledWith('patch', 0);
    expect(core.setOutput).toHaveBeenCalledWith('build', []);
    expect(core.setOutput).toHaveBeenCalledWith('prerelease', ['alpha', 4]);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('fails on invalid path', () => {
    vi.stubEnv('INPUT_PATH', join(process.cwd(), 'tests/dummy-2.json'));

    run();

    expect(core.setOutput).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalled();
  });
});

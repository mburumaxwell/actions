import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@actions/core', () => ({
  getInput: vi.fn((name: string) => process.env[`INPUT_${name.toUpperCase()}`] || ''),
  setOutput: vi.fn(),
  setFailed: vi.fn(),
  info: vi.fn(),
}));

// Mock the fs module
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  rmSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

import * as core from '@actions/core';
import * as fs from 'node:fs';
import { run } from '../src/zephyr-version-file';

describe('zephyr-version-file action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('works for valid simple version', () => {
    vi.stubEnv('INPUT_VERSION', '3.0.0');
    vi.stubEnv('INPUT_DESTINATION', './temp/1/VERSION');

    run();

    const contents = [
      'VERSION_MAJOR = 3',
      'VERSION_MINOR = 0',
      'PATCHLEVEL = 0',
      'VERSION_TWEAK = 0',
      'EXTRAVERSION = ',
      '',
    ].join('\n');
    expect(core.setOutput).toHaveBeenCalledWith('contents', contents);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalledWith('./temp/1/VERSION', contents, 'utf-8');
    expect(vi.mocked(fs.existsSync)).toHaveBeenCalledWith('./temp/1/VERSION');
    expect(vi.mocked(fs.rmSync)).not.toHaveBeenCalled();
  });

  it('works for valid complex version', () => {
    vi.stubEnv('INPUT_VERSION', '3.1.4-alpha.1');
    vi.stubEnv('INPUT_DESTINATION', './temp/2/VERSION');

    run();

    const contents = [
      'VERSION_MAJOR = 3',
      'VERSION_MINOR = 1',
      'PATCHLEVEL = 4',
      'VERSION_TWEAK = 0',
      'EXTRAVERSION = alpha.1',
      '',
    ].join('\n');
    expect(core.setOutput).toHaveBeenCalledWith('contents', contents);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalledWith('./temp/2/VERSION', contents, 'utf-8');
    expect(vi.mocked(fs.existsSync)).toHaveBeenCalledWith('./temp/2/VERSION');
    expect(vi.mocked(fs.rmSync)).not.toHaveBeenCalled();
  });

  it('works for valid version with tweak', () => {
    vi.stubEnv('INPUT_VERSION', '3.1.4-alpha.1+1');
    vi.stubEnv('INPUT_DESTINATION', './temp/3/VERSION');

    run();

    const contents = [
      'VERSION_MAJOR = 3',
      'VERSION_MINOR = 1',
      'PATCHLEVEL = 4',
      'VERSION_TWEAK = 1',
      'EXTRAVERSION = alpha.1',
      '',
    ].join('\n');
    expect(core.setOutput).toHaveBeenCalledWith('contents', contents);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalledWith('./temp/3/VERSION', contents, 'utf-8');
    expect(vi.mocked(fs.existsSync)).toHaveBeenCalledWith('./temp/3/VERSION');
    expect(vi.mocked(fs.rmSync)).not.toHaveBeenCalled();
  });

  it('fails for invalid version', () => {
    vi.stubEnv('INPUT_VERSION', 'abcd');

    run();

    expect(core.setOutput).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalled();
  });
});

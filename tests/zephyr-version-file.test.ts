import * as core from '@actions/core';
import * as fs from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { run } from '../src/zephyr-version-file';

// Mock the fs module
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  rmSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe('zephyr-version-file action', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('works for valid simple version', () => {
    vi.stubEnv('INPUT_VERSION', '3.0.0');
    vi.stubEnv('INPUT_DESTINATION', './temp/1/VERSION');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    const contents = [
      'VERSION_MAJOR = 3',
      'VERSION_MINOR = 0',
      'PATCHLEVEL = 0',
      'VERSION_TWEAK = 0',
      'EXTRAVERSION = ',
      '',
    ].join('\n');
    expect(setOutput).toHaveBeenCalledWith('contents', contents);
    expect(setFailed).not.toHaveBeenCalled();
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalledWith('./temp/1/VERSION', contents, 'utf-8');
    expect(vi.mocked(fs.existsSync)).toHaveBeenCalledWith('./temp/1/VERSION');
    expect(vi.mocked(fs.rmSync)).not.toHaveBeenCalled();
  });

  it('works for valid complex version', () => {
    vi.stubEnv('INPUT_VERSION', '3.1.4-alpha.1');
    vi.stubEnv('INPUT_DESTINATION', './temp/2/VERSION');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    const contents = [
      'VERSION_MAJOR = 3',
      'VERSION_MINOR = 1',
      'PATCHLEVEL = 4',
      'VERSION_TWEAK = 0',
      'EXTRAVERSION = alpha.1',
      '',
    ].join('\n');
    expect(setOutput).toHaveBeenCalledWith('contents', contents);
    expect(setFailed).not.toHaveBeenCalled();
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalledWith('./temp/2/VERSION', contents, 'utf-8');
    expect(vi.mocked(fs.existsSync)).toHaveBeenCalledWith('./temp/2/VERSION');
    expect(vi.mocked(fs.rmSync)).not.toHaveBeenCalled();
  });

  it('works for valid version with tweak', () => {
    vi.stubEnv('INPUT_VERSION', '3.1.4-alpha.1+1');
    vi.stubEnv('INPUT_DESTINATION', './temp/3/VERSION');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    const contents = [
      'VERSION_MAJOR = 3',
      'VERSION_MINOR = 1',
      'PATCHLEVEL = 4',
      'VERSION_TWEAK = 1',
      'EXTRAVERSION = alpha.1',
      '',
    ].join('\n');
    expect(setOutput).toHaveBeenCalledWith('contents', contents);
    expect(setFailed).not.toHaveBeenCalled();
    expect(vi.mocked(fs.writeFileSync)).toHaveBeenCalledWith('./temp/3/VERSION', contents, 'utf-8');
    expect(vi.mocked(fs.existsSync)).toHaveBeenCalledWith('./temp/3/VERSION');
    expect(vi.mocked(fs.rmSync)).not.toHaveBeenCalled();
  });

  it('fails for invalid version', () => {
    vi.stubEnv('INPUT_VERSION', 'abcd');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setOutput).not.toHaveBeenCalled();
    expect(setFailed).toHaveBeenCalled();
  });
});

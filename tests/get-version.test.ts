import * as core from '@actions/core';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { run } from '../src/get-version';

describe('get-version action', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('works with valid path', () => {
    vi.stubEnv('INPUT_PATH', join(process.cwd(), 'tests/dummy.json'));
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setOutput).toHaveBeenCalledWith('version', '3.1.0-alpha.4');
    expect(setFailed).not.toHaveBeenCalled();
  });

  it('fails on invalid path', () => {
    vi.stubEnv('INPUT_PATH', join(process.cwd(), 'tests/dummy-2.json'));
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setOutput).not.toHaveBeenCalled();
    expect(setFailed).toHaveBeenCalled();
  });
});

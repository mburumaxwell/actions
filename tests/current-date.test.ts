import * as core from '@actions/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { run } from '../src/current-date';

describe('current-date action', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('sets the output using the default format', () => {
    vi.setSystemTime(new Date('2025-05-09T10:30:00Z'));
    vi.stubEnv('INPUT_FORMAT', 'MMMM dd, yyyy');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setOutput).toHaveBeenCalledWith('date', 'May 09, 2025');
    expect(setFailed).not.toHaveBeenCalled();
  });

  it('formats date using ISO format', () => {
    vi.setSystemTime(new Date('2025-05-09T10:30:00Z'));
    vi.stubEnv('INPUT_FORMAT', 'yyyy-MM-dd');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setOutput).toHaveBeenCalledWith('date', '2025-05-09');
    expect(setFailed).not.toHaveBeenCalled();
  });

  it('fails on invalid format string', () => {
    vi.stubEnv('INPUT_FORMAT', 'INVALID-FORMAT');
    const setOutput = vi.spyOn(core, 'setOutput');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setOutput).not.toHaveBeenCalled();
    expect(setFailed).toHaveBeenCalled();
  });
});

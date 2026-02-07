import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@actions/core', () => ({
  getInput: vi.fn((name: string) => process.env[`INPUT_${name.toUpperCase()}`] || ''),
  setOutput: vi.fn(),
  setFailed: vi.fn(),
  info: vi.fn(),
}));

import * as core from '@actions/core';
import { run } from '../src/current-date';

describe('current-date action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('sets the output using the default format', () => {
    vi.setSystemTime(new Date('2025-05-09T10:30:00Z'));
    vi.stubEnv('INPUT_FORMAT', 'MMMM dd, yyyy');

    run();

    expect(core.setOutput).toHaveBeenCalledWith('date', 'May 09, 2025');
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('formats date using ISO format', () => {
    vi.setSystemTime(new Date('2025-05-09T10:30:00Z'));
    vi.stubEnv('INPUT_FORMAT', 'yyyy-MM-dd');

    run();

    expect(core.setOutput).toHaveBeenCalledWith('date', '2025-05-09');
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('fails on invalid format string', () => {
    vi.stubEnv('INPUT_FORMAT', 'INVALID-FORMAT');

    run();

    expect(core.setOutput).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalled();
  });
});

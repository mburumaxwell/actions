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
  });

  it('sets the output using the default format', () => {
    vi.setSystemTime(new Date('2025-05-09T10:30:00Z'));

    vi.spyOn(core, 'getInput').mockReturnValue('MMMM dd, yyyy');
    const setOutput = vi.spyOn(core, 'setOutput');

    run();

    expect(setOutput).toHaveBeenCalledWith('date', 'May 09, 2025');
  });

  it('formats date using ISO format', () => {
    vi.setSystemTime(new Date('2025-05-09T10:30:00Z'));

    vi.spyOn(core, 'getInput').mockReturnValue('yyyy-MM-dd');
    const setOutput = vi.spyOn(core, 'setOutput');

    run();

    expect(setOutput).toHaveBeenCalledWith('date', '2025-05-09');
  });

  it('fails on invalid format string', () => {
    vi.spyOn(core, 'getInput').mockReturnValue('INVALID-FORMAT');
    const setFailed = vi.spyOn(core, 'setFailed');

    run();

    expect(setFailed).toHaveBeenCalled();
  });
});

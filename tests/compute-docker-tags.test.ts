import { expect, test, vi } from 'vitest';

vi.mock('@actions/core', () => ({
  getInput: vi.fn((name: string, options?: { required?: boolean }) => process.env[`INPUT_${name.toUpperCase()}`] || ''),
  setOutput: vi.fn(),
  setFailed: vi.fn(),
  info: vi.fn(),
}));

vi.mock('@actions/github', () => ({
  context: {
    action: '',
    actor: '',
    apiUrl: '',
    eventName: '',
    graphqlUrl: '',
    issue: { number: 0, owner: 'tesla', repo: 'self-driving' },
    job: '',
    payload: {},
    ref: '',
    repo: { owner: 'tesla', repo: 'self-driving' },
    runId: 0,
    runNumber: 0,
    serverUrl: '',
    sha: '',
    workflow: '',
  },
}));

import * as core from '@actions/core';
import * as github from '@actions/github';
import { run } from '../src/compute-docker-tags';

test('Compute Docker Tags', async () => {
  vi.clearAllMocks();
  vi.stubEnv('INPUT_IMAGE', 'ghcr.io/tesla/self-driving');
  vi.stubEnv('INPUT_SHORT_SHA', 'abc1234');
  vi.stubEnv('INPUT_FULL_SEMVER', '1.2.3');
  vi.stubEnv('INPUT_MAJOR', '1');
  vi.stubEnv('INPUT_MINOR', '2');

  // exports tags based on a tag ref
  github.context.ref = 'refs/tags/1.2.3';
  run();
  expect(core.setOutput).toHaveBeenCalledWith(
    'tags',
    expect.stringMatching(
      [
        'ghcr.io/tesla/self-driving:1.2.3',
        'ghcr.io/tesla/self-driving:latest',
        'ghcr.io/tesla/self-driving:abc1234',
        'ghcr.io/tesla/self-driving:1.2',
        'ghcr.io/tesla/self-driving:1',
      ].join(','),
    ),
  );

  // exports tags based on main branch
  github.context.ref = 'refs/heads/main';
  vi.stubEnv('INPUT_FULL_SEMVER', '1.2.4-ci.1');
  run();
  expect(core.setOutput).toHaveBeenCalledWith(
    'tags',
    expect.stringMatching(
      [
        'ghcr.io/tesla/self-driving:1.2.4-ci.1',
        'ghcr.io/tesla/self-driving:latest',
        'ghcr.io/tesla/self-driving:abc1234',
      ].join(','),
    ),
  );

  // exports tags based on non-main branch
  github.context.ref = 'refs/heads/dev';
  vi.stubEnv('INPUT_FULL_SEMVER', '1.2.4-ci.4');
  run();
  expect(core.setOutput).toHaveBeenCalledWith(
    'tags',
    expect.stringMatching(['ghcr.io/tesla/self-driving:1.2.4-ci.4'].join(',')),
  );
  expect(core.setFailed).not.toHaveBeenCalled();

  vi.unstubAllEnvs();
});
